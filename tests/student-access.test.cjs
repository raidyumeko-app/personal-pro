const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
// Regra de 11/11/2026: a área de treino do aluno é gratuita para sempre; só a nutrição extra é paga.
function harness(api){
 let states=[],index=0,effects=[],dataReads=0,accessReads=0;
 const root={addEventListener(){},removeEventListener(){},PersonalProCloud:{signOut:async()=>{}},PersonalProMedia:{resolve:x=>x},PersonalProUI:{Icon(){}}};
 root.PersonalProAPI={studentAccess:async()=>{accessReads++;return {active:false,status:'expired'}},studentData:async()=>{dataReads++;if(api.fail)throw Error('Sem conexão');return {linkId:'l',student:{name:'QA',workout:[]},trainerName:'QA Trainer'}},sessions:async()=>[]};
 const R={createElement:(type,props,...children)=>({type,props,children}),useState(v){let i=index++;if(!(i in states))states[i]=typeof v==='function'?v():v;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v]},useEffect(fn){effects.push(fn)},Fragment:'Fragment'};
 vm.runInNewContext(fs.readFileSync('portal-app.js','utf8'),{window:root,Date,URLSearchParams,location:{search:''},fetch:async()=>({json:async()=>[]}),setTimeout:fn=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
 root.PersonalProPortal.Shell({React:R,Legacy:()=>{}});states=[];
 const render=()=>{index=0;effects=[];return root.PersonalProPortal.Student({member:{name:'QA',gender:'undisclosed',created_at:'2026-01-01T00:00:00Z'}})};
 return {render,run:async()=>{effects[0]();await new Promise(r=>setImmediate(r))},reads:()=>dataReads,accessReads:()=>accessReads};
}
test('student after 30 days keeps the full workout area, without paywall or ads option',async()=>{
 const t=harness({});t.render();await t.run();const screen=JSON.stringify(t.render());
 assert.match(screen,/Um treino de cada vez/);assert.match(screen,/QA Trainer/);
 assert.ok(!screen.includes('Seu período gratuito terminou'));assert.ok(!/R\$ 9,90/.test(screen));assert.ok(!screen.includes('Continuar grátis com anúncios'));
 assert.equal(t.reads(),1);assert.equal(t.accessReads(),0,'workout area must not depend on the paid status');
});
test('failed load keeps data and offers retry instead of a paywall',async()=>{const t=harness({fail:true});t.render();await t.run();const screen=JSON.stringify(t.render());assert.match(screen,/Não foi possível carregar seus treinos/);assert.match(screen,/Tentar novamente/);assert.ok(!screen.includes('Assinar'))});
