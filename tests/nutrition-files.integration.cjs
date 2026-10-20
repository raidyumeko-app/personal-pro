// Run: node --experimental-vm-modules tests/nutrition-files.integration.cjs
// Uses the runtime's @napi-rs/canvas to supply browser image/canvas primitives.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url'),crypto=require('node:crypto');
const canvas=require('@napi-rs/canvas');
Object.assign(global,{DOMMatrix:canvas.DOMMatrix,Path2D:canvas.Path2D,ImageData:canvas.ImageData});
const requests=[];
global.window={PersonalProCloud:{userId:()=> 'qa-file-owner',request:async(path,options)=>{requests.push({path,options});if(path.includes('/sign/'))return {signedURL:'/object/sign/qa?token=TEST'};return []}}};
vm.runInThisContext(fs.readFileSync('nutrition.js','utf8'),{importModuleDynamically:async spec=>import(pathToFileURL(process.cwd()+spec).href)});
vm.runInThisContext(fs.readFileSync('portal-api.js','utf8'));
const fixture=name=>new File([fs.readFileSync('tests/fixtures/nutrition/'+name)],name,{type:name.endsWith('.pdf')?'application/pdf':'image/jpeg'});
(async()=>{
 global.pdfjsWorker=await import(pathToFileURL(process.cwd()+'/vendor/pdfjs/pdf.worker.mjs').href);
 const text=await window.PersonalProNutrition.extract(fixture('dieta-texto-qa.pdf'));
 assert.equal(text.meals.length,2);assert.equal(text.scanned,false);assert.equal(text.meals[0].time,'07:00');assert.equal(text.meals[1].time,'12:00');assert.match(text.meals[0].text,/100 g\nObservação QA/);assert.match(text.meals[1].text,/150 g\nSubstituição QA: Alimento C - 80 g/);
 const scan=await window.PersonalProNutrition.extract(fixture('dieta-escaneada-qa.pdf'));
 assert.equal(scan.scanned,true);assert.equal(scan.uncertain,true);assert.equal(scan.meals.length,0);
 await assert.rejects(window.PersonalProNutrition.extract(new File(['invalid'],'bad.txt',{type:'text/plain'})),/PDF de até 10 MB/);
 await assert.rejects(window.PersonalProNutrition.extract({type:'application/pdf',size:10485761}),/PDF de até 10 MB/);
 global.createImageBitmap=async file=>{const image=await canvas.loadImage(Buffer.from(await file.arrayBuffer()));image.close=()=>{};return image};
 global.document={createElement(){const c=canvas.createCanvas(1,1);c.toBlob=fn=>c.encode('jpeg').then(bytes=>fn(new Blob([bytes],{type:'image/jpeg'})));return c}};
 const photo=await window.PersonalProAPI.compress(fixture('imagem-qa.jpg'));assert.equal(photo.type,'image/jpeg');const image=await canvas.loadImage(Buffer.from(await photo.arrayBuffer()));assert.ok(Math.max(image.width,image.height)<=1280);assert.ok(photo.size>0);
 const pdfPath=await window.PersonalProAPI.upload(fixture('dieta-texto-qa.pdf'));
 const photoPath=await window.PersonalProAPI.upload(photo);
 assert.match(pdfPath,/^qa-file-owner\/.+\.pdf$/);assert.match(photoPath,/^qa-file-owner\/.+\.jpg$/);
 assert.equal(requests[0].options.headers['Content-Type'],'application/pdf');assert.equal(requests[1].options.headers['Content-Type'],'image/jpeg');
 await window.PersonalProAPI.signed(pdfPath);const count=requests.length;await assert.rejects(window.PersonalProAPI.signed('another-user/private.pdf'),/outra conta/);assert.equal(requests.length,count);
 await assert.rejects(window.PersonalProAPI.compress(new File(['x'],'x.pdf',{type:'application/pdf'})),/fotografia/);
 // Exercise file selection -> editable review -> explicit confirmation -> persisted plan.
 let states=[],refs=[],index=0,refIndex=0,effects=[],tree,savedPlan=null;
 window.PersonalProAPI.studentAccess=async()=>({active:true});window.PersonalProAPI.nutrition=async()=>[[],savedPlan?[savedPlan]:[]];
 const write=window.PersonalProAPI.write;window.PersonalProAPI.write=async(table,item)=>{await write(table,item);savedPlan={...item,occurred_at:new Date().toISOString()}};
 const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=index++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useRef(v){return refs[refIndex++]||=({current:v})},useEffect(fn){effects.push(fn)}};
 const render=()=>{index=refIndex=0;effects=[];tree=window.PersonalProNutrition.Panel({React:R,member:{}})};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.children)}walk(tree);return out};
 const txt=n=>typeof n==='string'?n:Array.isArray(n)?n.map(txt).join(''):txt(n?.children||[]);
 const click=label=>nodes().find(n=>n.type==='button'&&txt(n)===label).props.onClick();
 const settle=async()=>{for(let n=0;n<200;n++){await new Promise(r=>setImmediate(r));render();if(!states[6])return}throw Error('Nutrition operation did not settle')};
 render();effects[0]();await settle();click('Importar');render();nodes().find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});render();
 nodes().find(n=>n.type==='input'&&n.props.type==='file').props.onChange({target:{files:[fixture('dieta-texto-qa.pdf')]}});await settle();assert.match(txt(tree),/Conferência obrigatória/);assert.equal(savedPlan,null,'Selecting a PDF must not activate it');
 nodes().find(n=>n.props['aria-label']==='Título da refeição 1').props.onChange({target:{value:'QA café conferido'}});render();await click('Conferi e quero ativar o plano');render();assert.equal(savedPlan.confirmed,true);assert.equal(savedPlan.plan_data.meals[0].title,'QA café conferido');assert.equal(savedPlan.plan_data.meals.length,2);assert.match(savedPlan.file_path,/\.pdf$/);assert.match(txt(tree),/Plano salvo com o PDF original/);
 // A new panel restores the saved plan through the data adapter.
 states=[];refs=[];render();effects[0]();await settle();assert.match(txt(tree),/QA café conferido/);assert.match(txt(tree),/100 g/);
 console.log('PASS: real text/scanned PDFs; exact portions and review data; invalid/oversize rejection; real JPEG compression; owner paths, MIME and signed-file guard. Storage HTTP calls are mocked; no browser upload claimed.');
})().catch(e=>{console.error(e);process.exitCode=1});
