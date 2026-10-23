const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),catalog=read('exercise-library.json'),selection=read('docs/research/selected-library.json');
function media(host){const window={location:{hostname:host}};vm.runInNewContext(fs.readFileSync('exercise-media.js','utf8'),{window});return window.PersonalProMedia;}
test('original selection is preserved and only the thirteen required video exercise variants are added',()=>{
 assert.equal(catalog.length,143);assert.equal(new Set(catalog.map(x=>x.name )).size,143);assert.equal(new Set(catalog.map(x=>x.id )).size,143);
 assert.deepEqual(catalog.slice(0,130).map(x=>x.name),selection.exercises.map(x=>x.name));assert.equal(Object.keys(selection.mergedAliases).length,6);
 for(const excluded of ['Levantamento terra com barra','Agachamento no Smith','Air bike','Ski ergômetro'])assert.ok(!catalog.some(x=>x.name===excluded));
 assert.ok(catalog.some(x=>x.name==='Rosca 21'));assert.ok(catalog.some(x=>x.name==='Mobilidade de quadril'));
});
test('preview media expands 143 choices with 87 base videos without falsely granting commercial rights',()=>{
 const preview=media('personal-123456789-raidyumeko-9261.vercel.app');assert.equal(preview.previewEntries.length,81);assert.equal(catalog.filter(x=>preview.resolve(x).video).length,87);
 for(const entry of preview.previewEntries){assert.ok(catalog.some(x=>x.id===entry.sourceId));assert.equal(entry.video.licensed,false);assert.equal(entry.video.previewOnly,true);for(const url of Object.values(entry.video.variants))assert.match(url,/^https:\/\/pub-585d42eb1aa64a67aedf483ec328d3fe\.r2\.dev\/exercise-videos\/(male|female)\//);}
 for(const host of ['personal-pro.vercel.app','personal-pro-raidyumeko-9261.vercel.app','personalpro.app','personal-123456789-raidyumeko-9261.vercel.app.evil.example'])assert.equal(media(host).resolve(catalog.find(x=>x.name==='Crucifixo com halteres')).video,undefined);
 assert.ok(preview.resolve(catalog.find(x=>x.name==='Crucifixo com halteres')).video.variants.female);
 for(const name of ['Ponte de glúteo','Alongamento de adutores','Bicicleta','Elevação posterior (crucifixo inverso)'])assert.equal(preview.resolve(catalog.find(x=>x.name===name)).video,undefined,name);
});
test('compatibility reads only already prescribed identities and never reopens the full catalog',async()=>{
 const window={};vm.runInNewContext(fs.readFileSync('exercise-compatibility.js','utf8'),{window});const api=window.PersonalProExerciseCompatibility;
 let requests=[];const fetcher=async url=>{requests.push(url);return{ok:true,json:async()=>url.includes('instructions')?read('docs/compatibility/exercise-instructions-archive.pt.json'):read('docs/compatibility/exercise-source-archive.json')}};
 const selected=await api.forWorkouts(catalog,{},[{sourceId:catalog[0].id}],fetcher);assert.equal(requests.length,0);assert.equal(selected.catalog.length,143);
 const old={sourceId:'Romanian_Deadlift',name:'Treino antigo',series:'4',repetitions:'8',load:'42.5 kg',rest:90};
 const resolved=await api.forWorkouts(catalog,{},[old],fetcher);assert.equal(requests.length,2);assert.equal(resolved.catalog.length,144);assert.equal(resolved.catalog.at(-1).id,old.sourceId);assert.ok(resolved.translations[old.sourceId].length);assert.equal(old.rest,90);
 const failed=await api.forWorkouts(catalog,{},[old],async()=>{throw Error('offline')});assert.equal(failed.catalog.length,143);
});
test('execution can switch male/female demonstrations and recover from a failed clip',async()=>{
 const root={location:{hostname:'localhost'},PersonalProUI:{Icon(){}}};for(const file of ['exercise-media.js','workout-session.js','workout-session-preview.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:root,globalThis:root});
 let state=[],i=0,tree;const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:{...props,children}}),useState(v){const n=i++;if(!(n in state))state[n]=typeof v==='function'?v():v;return[state[n],v=>state[n]=typeof v==='function'?v(state[n]):v]},useEffect(){}};
 const exercise=catalog.find(x=>x.name==='Crucifixo com halteres');const render=()=>{i=0;tree=root.PersonalProSessionPreview.Simulator({React:R,studentId:'qa',day:'A',exercises:[{...exercise,series:'3',repetitions:'12',rest:60}]})};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.props?.children)}walk(tree);return out};
 const txt=n=>typeof n==='string'?n:Array.isArray(n)?n.map(txt).join(''):txt(n?.props?.children||[]);
 render();await nodes().find(n=>n.type==='button'&&txt(n)==='Conferir execução').props.onClick();render();let video=nodes().find(n=>n.type==='video');assert.match(video.props.src,/\/male\//);assert.ok(!/licen[çc]a|comprova|Demonstração em teste|free-exercise-db-api/i.test(txt(tree)));video.props.onError();render();assert.ok(!nodes().some(n=>n.type==='video'));
 nodes().find(n=>n.props?.['aria-label']==='Modelo da demonstração').props.onChange({target:{value:'female'}});render();video=nodes().find(n=>n.type==='video');assert.match(video.props.src,/\/female\//);assert.ok(nodes().some(n=>n.type==='button'&&txt(n)==='Registrar série 1 de 3'));
});
