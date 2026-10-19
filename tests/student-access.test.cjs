const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function harness(status){
 let states=[],index=0,effects=[],timers=[],dataReads=0;
 const root={addEventListener(){},removeEventListener(){},PersonalProCloud:{signOut:async()=>{}},PersonalProMedia:{resolve:x=>x},PersonalProUI:{Icon(){}}};
 root.PersonalProAPI={studentAccess:async()=>status.current,studentData:async()=>{dataReads++;return {student:{name:'QA',workout:[]},trainerName:'QA Trainer'}},sessions:async()=>[]};
 const R={createElement:(type,props,...children)=>({type,props,children}),useState(v){let i=index++;if(!(i in states))states[i]=typeof v==='function'?v():v;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v]},useEffect(fn){effects.push(fn)}};
 vm.runInNewContext(fs.readFileSync('portal-app.js','utf8'),{window:root,Date,URLSearchParams,location:{search:''},fetch:async()=>({json:async()=>[]}),setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){}});
 root.PersonalProPortal.Shell({React:R,Legacy:()=>{}});states=[];
 const render=()=>{index=0;effects=[];return root.PersonalProPortal.Student({member:{name:'QA',gender:'undisclosed'}})};
 return {render,run:async()=>{effects[0]();await new Promise(r=>setImmediate(r))},effect:()=>effects[1](),expire:async()=>{timers.at(-1)();await new Promise(r=>setImmediate(r))},reads:()=>dataReads};
}
test('expired student sees subscription gate without fetching workouts or ads option',async()=>{
 const t=harness({current:{active:false,status:'expired'}});t.render();await t.run();const screen=JSON.stringify(t.render());assert.match(screen,/Seu período gratuito terminou/);assert.match(screen,/Assinar por R\$ 9,90\/mês/);assert.ok(!screen.includes('Continuar grátis com anúncios'));assert.equal(t.reads(),0);
});
test('trial grants the student area and expiration rechecks server access',async()=>{
 const status={current:{active:true,status:'trial',serverNow:'2026-10-19T00:00:00Z',expiresAt:'2026-10-20T00:00:00Z'}};const t=harness(status);t.render();await t.run();assert.match(JSON.stringify(t.render()),/Um treino de cada vez/);assert.equal(t.reads(),1);t.effect();status.current={active:false,status:'expired'};await t.expire();assert.match(JSON.stringify(t.render()),/Seu período gratuito terminou/);assert.equal(t.reads(),1);
});
test('unavailable server access fails closed',async()=>{const t=harness({get current(){throw Error('Sem conexão')}});t.render();await t.run();assert.match(JSON.stringify(t.render()),/Não foi possível conferir seu acesso/);assert.equal(t.reads(),0)});
