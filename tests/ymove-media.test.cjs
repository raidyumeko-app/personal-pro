const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root={PersonalProUI:{Icon(){}}};vm.runInNewContext(fs.readFileSync('exercise-media.js','utf8'),{window:root});
const manifest=JSON.parse(fs.readFileSync('docs/research/ymove-free-media-manifest.json','utf8'));
test('authorized YMove matches expand the existing library without replacing local licensed media',()=>{
 const media=root.PersonalProMedia,added=media.entries.filter(e=>e.id.startsWith('ymove-'));assert.equal(added.length,16);assert.equal(media.entries.length,24);assert.equal(new Set(media.entries.map(e=>e.sourceId)).size,24);
 const catalog=JSON.parse(fs.readFileSync('exercise-library.json','utf8'));
 for(const entry of manifest.entries){assert.ok([...catalog,...JSON.parse(fs.readFileSync('docs/compatibility/exercise-source-archive.json','utf8'))].some(e=>e.id===entry.sourceId));const resolved=media.resolve({sourceId:entry.sourceId,name:'Prescrição QA',series:'4',repetitions:'8',load:'42.5 kg',rest:90});assert.equal(resolved.video.url,entry.videoUrl);assert.equal(resolved.poster,entry.thumbnailUrl);assert.equal(resolved.series,'4');assert.equal(resolved.rest,90);assert.equal(resolved.video.licensed,true);assert.match(resolved.video.licenseUrl,/^https:\/\/ymove\.app\/free-exercise-videos/);assert.ok(entry.durationSeconds>0&&entry.bytes>0);}
 assert.match(media.resolve({sourceId:'One-Arm_Dumbbell_Row',name:'Remada unilateral com halter'}).video.demonstrationVariant,/apoiada na perna/);
 assert.equal(media.resolve({name:'Supino reto com barra'}).video.url,'/media/exercises/73.mp4');assert.equal(media.resolve({name:'Leg press 45 graus'}).video.url,'/media/exercises/371.mp4');
});
test('media uses the prescribed source identity before a conflicting display name',()=>{
 const e=root.PersonalProMedia.resolve({sourceId:'Hammer_Curls',name:'Supino reto com barra'});assert.match(e.video.originalUrl,/b11e6c6f-b2e8-44ca-95dc-adf0dcd34426/);
});
test('different grips, equipment and variants are not silently assigned a free clip',()=>{
 for(const id of ['Glute_Kickback','One-Arm_Kettlebell_Swings','Triceps_Pushdown','Bodyweight_Squat','Cable_Crossover','Romanian_Deadlift'])assert.equal(root.PersonalProMedia.resolve({sourceId:id,name:'QA variant'}).video,undefined,id);
 assert.equal(root.PersonalProMedia.resolve({name:'Puxada frontal com pegada neutra'}).video.url,manifest.entries.find(e=>e.sourceId==='V-Bar_Pulldown').videoUrl);
});
test('execution offers the new video and still permits set recording when media fails',async()=>{
 vm.runInNewContext(fs.readFileSync('workout-session.js','utf8'),{globalThis:root});vm.runInNewContext(fs.readFileSync('workout-session-preview.js','utf8'),{window:root});
 let state=[],i=0,tree;const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:{...props,children}}),useState(v){const n=i++;if(!(n in state))state[n]=typeof v==='function'?v():v;return[state[n],v=>state[n]=typeof v==='function'?v(state[n]):v]},useEffect(){}};
 const render=()=>{i=0;tree=root.PersonalProSessionPreview.Simulator({React:R,studentId:'qa',day:'A',exercises:[{id:'qa-ex',sourceId:'Leg_Extensions',name:'Cadeira extensora',series:'3',repetitions:'12',rest:60}]});return tree};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.props?.children)}walk(tree);return out};
 const txt=n=>typeof n==='string'?n:Array.isArray(n)?n.map(txt).join(''):txt(n?.props?.children||[]);
 render();await nodes().find(n=>n.type==='button'&&txt(n)==='Conferir execução').props.onClick();render();const video=nodes().find(n=>n.type==='video');assert.ok(video.props.playsInline&&video.props.controls);assert.match(video.props.src,/ymove\.app\/api\/free/);video.props.onError();render();assert.ok(!nodes().some(n=>n.type==='video'));assert.ok(nodes().some(n=>n.type==='img'));assert.ok(nodes().some(n=>n.type==='button'&&txt(n)==='Registrar série 1 de 3'));
});
