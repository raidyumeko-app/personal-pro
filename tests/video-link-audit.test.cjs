const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const catalog=JSON.parse(fs.readFileSync('exercise-library.json'));
function boot(host='localhost'){
 const window={location:{hostname:host},PersonalProUI:{Icon(){}}};
 for(const file of ['exercise-media.js','personal-pro-ymove-verified.js','personal-pro-generated-videos.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),{window});
 return window;
}
test('46 chosen generations are reachable under distinct exercise identities; rejected and superseded takes stay out',()=>{
 const root=boot(),api=root.PersonalProGeneratedVideos,ids=new Set();
 assert.equal(api.items.length,70);assert.equal(api.linkedCount,46);
 for(const item of api.items){
  if(!item.linkAllowed){
   if(item.duplicateOf){assert.ok(api.items.some(original=>original.id===item.duplicateOf));assert.ok(api.items.some(chosen=>chosen.sourceId===item.sourceId&&chosen.linkAllowed));}
   else if(item.supersededBy){assert.ok(api.items.some(chosen=>chosen.id===item.supersededBy&&chosen.linkAllowed));}
   else if(item.sourceId===null){assert.match(item.requestedName,/Superman/);}
   else{assert.ok(item.rejectionReason);assert.equal(api.forExercise(item.sourceId).some(chosen=>chosen.id===item.id),false);}
   continue;
  }
  ids.add(item.sourceId);const ex=catalog.find(ex=>ex.id===item.sourceId);assert.ok(ex,item.name);
  const result=root.PersonalProMedia.resolve({...ex,preferredGeneratedVideoId:item.id,series:'4',rest:90});
  assert.equal(result.video.url,item.url,item.id);assert.equal(result.video.variants,undefined);
  assert.equal(result.video.generationId,item.id);assert.equal(result.generatedVideoFinalReviewPending,true);
  assert.equal(result.series,'4');assert.equal(result.rest,90);assert.ok(item.matchedDescription.length>0);
  assert.equal(item.appName,ex.name);assert.equal(result.images[0],item.poster);
 }
 assert.equal(ids.size,46);
 for(const ex of catalog){const result=root.PersonalProMedia.resolve(ex);assert.ok(!/01a16723-7ac0-761c/.test(result.video?.generationId||''));}
});
test('incorrect original labels are reassigned by visible movement rather than copied into matching labels',()=>{
 const items=boot().PersonalProGeneratedVideos.items;
 for(const [index,id] of [[3,'Wide-Grip_Lat_Pulldown'],[5,'One-Arm_Dumbbell_Row'],[10,'Wide-Grip_Lat_Pulldown'],[15,'Pullups'],[22,'Pushups'],[29,'Plank']])assert.equal(items[index].sourceId,id,items[index].requestedName);
 assert.equal(items[45].sourceId,'pp-remada-unilateral-com-halter-apoio-na-coxa');
 assert.notEqual(items[45].sourceId,'One-Arm_Dumbbell_Row');
 assert.equal(items[46].sourceId,'pp-crossover-na-polia-media');
 assert.notEqual(items[46].sourceId,'Cable_Crossover');
});
test('IDs take priority over conflicting display names and unrelated generations cannot be selected',()=>{
 const root=boot();
 for(const item of root.PersonalProGeneratedVideos.items.filter(item=>item.linkAllowed)){
  assert.equal(root.PersonalProMedia.resolve({sourceId:'unknown-'+item.id,name:item.appName}).video,undefined);
 }
 const bench=root.PersonalProMedia.resolve({sourceId:'Barbell_Bench_Press_-_Medium_Grip',name:'Prancha frontal',preferredGeneratedVideoId:root.PersonalProGeneratedVideos.items[29].id});
 assert.equal(bench.video.generationId,root.PersonalProGeneratedVideos.items[47].id);
 assert.notEqual(bench.video.generationId,root.PersonalProGeneratedVideos.items[29].id);
});
test('YMove unilateral pulldown never becomes a two-handed V-bar demonstration',()=>{
 const media=boot().PersonalProMedia;
 for(const name of ['Puxada com pegada neutra','Puxada com triângulo','Puxada unilateral na polia'])assert.ok(!/5971eaa2/.test(media.resolve({sourceId:'V-Bar_Pulldown',name}).video?.url||''));
 const unilateral=media.resolve({sourceId:'selected-puxada-unilateral-na-polia',name:'Puxada unilateral na polia'});
 assert.equal(unilateral.video.variants,undefined);assert.equal(unilateral.generatedVideoFinalReviewPending,true);
});
test('generated videos have one chosen take and preserve prescription values; source references stay recorded',()=>{
 const root=boot();assert.equal(root.PersonalProVerifiedYMove.clips.length,14);
 for(const clip of root.PersonalProVerifiedYMove.clips){
  const ex={sourceId:clip.sourceId,name:clip.name,series:'3',repetitions:'8',rest:120,load:'24 kg'};
  const result=root.PersonalProMedia.resolve(ex);
  assert.ok(result.video.url===clip.url||result.generatedVideoFinalReviewPending);assert.ok(root.PersonalProVerifiedYMove.clips.some(x=>x.url===clip.url));
  for(const key of ['series','repetitions','rest','load'])assert.equal(result[key],ex[key]);
 }
 assert.match(root.PersonalProMedia.resolve({sourceId:'Goblet_Squat',name:'Agachamento goblet',equipment:'Halteres'}).video.url,/a2a797d0/);
 assert.match(root.PersonalProMedia.resolve({sourceId:'Goblet_Squat',name:'Agachamento goblet com kettlebell',equipment:'Kettlebell'}).video.url,/198d4a7d/);
});
test('execution offers exactly one chosen clip and still permits recording after playback failure',async()=>{
 const root=boot();for(const file of ['workout-session.js','workout-session-preview.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:root,globalThis:root});
 let state=[],i=0,tree;const React={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:{...props,children}}),useState(v){const n=i++;if(!(n in state))state[n]=typeof v==='function'?v():v;return[state[n],v=>state[n]=typeof v==='function'?v(state[n]):v]},useEffect(){}};
 const ex={...catalog.find(x=>x.id==='Seated_Cable_Rows'),series:'3',repetitions:'12',rest:60};
 const render=()=>{i=0;tree=root.PersonalProSessionPreview.Simulator({React,studentId:'qa',day:'A',exercises:[ex]});};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return;}out.push(n);walk(n.props?.children);}walk(tree);return out;};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):text(n?.props?.children||[]);
 render();await nodes().find(n=>n.type==='button'&&text(n)==='Conferir execução').props.onClick();render();
 assert.equal(nodes().filter(n=>n.type==='video').length,1);
 assert.equal(nodes().find(n=>n.type==='video').props.src,root.PersonalProGeneratedVideos.items[48].url);
 assert.ok(!nodes().some(n=>n.props?.['aria-label']==='Modelo da demonstração'));
 nodes().find(n=>n.type==='video').props.onError();render();
 assert.ok(!nodes().some(n=>n.type==='video'));
 assert.ok(nodes().some(n=>n.type==='button'&&text(n)==='Registrar série 1 de 3'));
 assert.equal(ex.rest,60);assert.equal(ex.series,'3');
});
test('no selected file or content hash is reused, and no active catalog exercises share a video URL',()=>{
 const root=boot(),items=root.PersonalProGeneratedVideos.items.filter(item=>item.linkAllowed),report=JSON.parse(fs.readFileSync('docs/evidence/video-assignments-current-2026-10-23.json'));
 assert.equal(items.length,46);assert.equal(new Set(items.map(x=>x.sourceId)).size,46);assert.equal(new Set(items.map(x=>x.url)).size,46);
 const active=report.items.filter(x=>x.linkAllowed);assert.equal(active.length,46);assert.equal(new Set(active.map(x=>x.sha256)).size,46);
 const hash=require('node:crypto');
 for(const item of items.filter(x=>x.url.startsWith('/assets/videos/chest/'))){assert.equal(hash.createHash('sha256').update(fs.readFileSync('.'+item.url)).digest('hex'),item.sha256);assert.ok(fs.existsSync('.'+item.poster));}
 const urls=catalog.map(ex=>root.PersonalProMedia.resolve(ex).video?.url).filter(Boolean);assert.equal(new Set(urls).size,urls.length);
});
test('low cable fly remains visibly pending and cannot fall back to an incorrect demonstration',()=>{
 for(const host of ['localhost','personal-123456789-raidyumeko-9261.vercel.app','personalpro.app']){
  const root=boot(host),ex=catalog.find(x=>x.id==='Low_Cable_Crossover');
  const result=root.PersonalProMedia.resolve({...ex,name:'Supino reto com barra',preferredGeneratedVideoId:'01a169f2-e3ec-7fa7-8cf9-da1901f98a0b',series:'3',rest:90});
  assert.equal(result.video,undefined);assert.equal(result.poster,null);assert.equal(result.images.length,0);assert.match(result.mediaWarning,/Vídeo em correção/);assert.equal(result.series,'3');assert.equal(result.rest,90);assert.equal(root.PersonalProGeneratedVideos.forExercise(ex.id).length,0);
 }
 const api=boot().PersonalProGeneratedVideos;assert.equal(api.chestReview.linkedCount,22);assert.equal(api.chestReview.complete,false);assert.equal(api.duplicateCount,6);
 for(const id of ['Dumbbell_Flyes','Decline_Dumbbell_Flyes'])assert.ok(api.forExercise(id)[0].technicalFlags.length);
});
