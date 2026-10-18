const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const start=html.indexOf('const exerciseLibrary='),end=html.indexOf('function exerciseDose',start),ctx={};vm.createContext(ctx);vm.runInContext(html.slice(start,end)+';globalThis.original=exerciseLibrary;globalThis.links=portugueseExerciseSources;',ctx);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'exercise-library.json'))),translated=JSON.parse(fs.readFileSync(path.join(root,'exercise-instructions.pt.json')));
const linked=ctx.enrichPortugueseExercises(catalog.map(item=>({...item,instructions:translated[item.id]})));
assert.equal(linked.length,180);assert.equal(Object.keys(ctx.links).length,136);
assert.deepEqual(Array.from(linked,item=>item.name),Array.from(ctx.original,item=>item.name));
assert.deepEqual(Array.from(linked,item=>item.group),Array.from(ctx.original,item=>item.group));
for(const [name,id] of Object.entries(ctx.links)){const item=linked.find(x=>x.name===name);assert.equal(item.sourceId,id);assert.ok(item.images.length,name);assert.ok(item.instructions.length,name);assert.deepEqual(item.instructions,translated[id]);}
assert.equal(linked.filter(item=>item.images?.length).length,136);
assert.equal(linked.find(x=>x.name==='Abdominal bicicleta').sourceId,'Air_Bike');
assert.equal(linked.find(x=>x.name==='Air bike').images,undefined);
assert.equal(linked.find(x=>x.name==='Supino reto com barra').sourceId,'Barbell_Bench_Press_-_Medium_Grip');
assert.equal(linked.find(x=>x.name==='Supino reto com halteres').sourceId,'Dumbbell_Bench_Press');
assert.equal(ctx.enrichPortugueseExercises([]).filter(x=>x.images).length,0);
assert.ok(html.includes('Foto indisponível no momento.'));assert.ok(html.includes('Ainda não temos foto desta variação.'));
console.log('PASS: 136 exact Portuguese matches with photos and translated instructions; all 180 names/groups preserved; absent source remains usable; cardio air bike never uses abdominal bicycle photos.');
