// Correções aprovadas em 11/11/2026 depois da auditoria da versão integrada.
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const base=path.join(__dirname,'..');const read=f=>fs.readFileSync(path.join(base,f),'utf8');
const fmt=require('../format-br.js');const engine=require('../workout-session.js');

test('formatação brasileira: vírgula decimal, datas dd/mm/aaaa e plural',()=>{
 assert.equal(fmt.decimal(72.5),'72,5');assert.equal(fmt.decimal('72.5'),'72,5');assert.equal(fmt.decimal('72,5'),'72,5');
 assert.equal(fmt.load('7.5 kg'),'7,5 kg');assert.equal(fmt.load('7,5 kg'),'7,5 kg');assert.equal(fmt.load('peso corporal'),'peso corporal');assert.equal(fmt.load('8.12 / 22.5kg'),'8,12 / 22,5kg');
 assert.equal(fmt.date('2026-11-10'),'10/11/2026');assert.equal(fmt.month('2026-11'),'11/2026');
 assert.equal(fmt.count(1,'exercício','exercícios'),'1 exercício');assert.equal(fmt.count(0,'exercício','exercícios'),'0 exercícios');assert.equal(fmt.count(3,'exercício','exercícios'),'3 exercícios');
 const html=read('index.html');
 assert.ok(html.includes('<script src="/format-br.js"></script>'));
 assert.ok(!html.includes('" exercício(s) na ficha'),'sem "exercício(s)" na ficha');
 assert.ok(html.includes('"Último peso: "+(globalThis.PersonalProFormat?.decimal?.(weight)??weight)+" kg"'));
 assert.ok(html.includes('["Carga",(globalThis.PersonalProFormat?.load?.(exercise.load)??exercise.load)||"A definir"]'));
});

test('CSV e PDF do financeiro usam datas dd/mm/aaaa',()=>{
 const root={PersonalProSchedule:{today:()=>'2026-11-10',validDate:v=>/^\d{4}-\d{2}-\d{2}$/.test(v)}};vm.runInNewContext(read('student-sections.js'),{window:root,globalThis:root});
 const csv=root.PersonalProStudentSections.financialReport({financialEntries:[{id:'1',date:'2026-11-02',type:'expense',amount:12.5,category:'Outros',description:'Teste'}]},'2026-11');
 assert.ok(csv.includes('"02/11/2026"'));assert.ok(!csv.includes('2026-11-02'));
 assert.match(read('student-sections.js'),/write\('Personal Pro - Financeiro '\+monthBR\(month\)\)/);
});

test('cartão "Pendente" da ficha usa o mesmo cálculo do Financeiro (recebimentos abatem)',()=>{
 assert.ok(read('index.html').includes('finance=api?.financeSummary(D,M?.financialEntries)'));
 const root={PersonalProSchedule:{today:()=>'2026-11-10'}};vm.runInNewContext(read('student-sections.js'),{window:root,globalThis:root});
 const student={id:'s1',planValue:150,planStatus:'pendente'};
 const api=root.PersonalProStudentSections;
 assert.equal(api.financeSummary(student).pending,150);
 assert.equal(api.financeSummary(student,[{type:'income',studentId:'s1',amount:150,date:'2026-11-10'}]).pending,0);
});

test('treino esquecido aberto: detecta treino antigo e nunca mostra duração absurda',()=>{
 const start='2026-11-10T21:33:00.000Z';
 const logs=[0,4,9,14,20].map((m,i)=>({exerciseId:'e-'+i,setNumber:1,reps:10,weightKg:40,at:new Date(Date.parse('2026-11-11T13:30:00.000Z')+m*60000).toISOString()}));
 const s={startedAt:start,completedAt:'2026-11-11T13:54:00.000Z',logs};
 assert.equal(engine.isStale({startedAt:start,completedAt:null},Date.parse('2026-11-11T13:00:00.000Z')),true);
 assert.equal(engine.isStale({startedAt:'2026-11-11T13:00:00.000Z',completedAt:null},Date.parse('2026-11-11T13:40:00.000Z')),false);
 assert.equal(engine.isStale({startedAt:start,completedAt:'2026-11-11T13:54:00.000Z'}),false,'treino concluído não é "antigo"');
 assert.equal(engine.durationMinutes(s),24,'conta só o bloco contínuo de séries de hoje');
 assert.equal(engine.durationMinutes({...s,logs:[]}),null,'sem séries com horário, não inventa duração');
 assert.equal(engine.durationMinutes({startedAt:'2026-11-11T13:00:00.000Z',completedAt:'2026-11-11T13:45:00.000Z',logs:[]}),45);
 assert.ok(engine.durationMinutes({startedAt:'2026-11-11T10:00:00.000Z',completedAt:'2026-11-11T12:59:00.000Z',logs:[]})<=180);
 const app=read('portal-app.js');
 assert.ok(!/Date\.parse\(summary\.startedAt\)\)\s*\/\s*60000/.test(app),'resumo não calcula mais início→fim direto');
 assert.match(app,/Recomeçar do zero/);assert.match(app,/Continuar de onde parei/);assert.match(app,/sessionEngine\?\.durationMinutes/);
 assert.match(app,/" série · " : " séries · "/);
});

function nutrition(entries,confirmAnswer){
 let states=[],refs=[],i=0,ri=0,effects=[],tree;const removed=[],asked=[];
 const root={PersonalProAPI:{studentAccess:async()=>({active:true,status:'trial',trialUntil:'2026-12-10T12:00:00Z'}),nutrition:async()=>[[],entries.filter(e=>!removed.some(r=>r.id===e.id))],signed:async()=>'blob:x',removeEntry:async(id,file)=>{removed.push({id,file})}},open(){},confirm:m=>{asked.push(m);return confirmAnswer}};
 const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useRef(v){return refs[ri++]||=({current:v})},useEffect(fn){effects.push(fn)}};
 vm.runInNewContext(read('nutrition.js'),{window:root,Date,crypto:require('node:crypto')});
 const render=()=>{i=ri=0;effects=[];tree=root.PersonalProNutrition.Panel({React:R,member:{}});return tree};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.children||[]):'';
 const nodes=()=>{const out=[];(function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.children)})(tree);return out};
 const click=label=>nodes().find(n=>n.type==='button'&&text(n)===label).props.onClick();
 return {start:async()=>{render();effects[0]();await new Promise(r=>setImmediate(r));render()},render,click,removed,asked};
}
test('excluir refeição pede confirmação e apaga a foto junto',async()=>{
 const meal={id:'m1',kind:'meal',text:'Ovos',file_path:'u/foto.jpg',occurred_at:'2026-11-10T10:00:00Z'};
 const no=nutrition([meal],false);await no.start();no.click('Diário');no.render();await no.click('Excluir registro');
 assert.equal(no.removed.length,0,'cancelar não apaga');assert.match(no.asked[0],/fotografia anexada/);
 const yes=nutrition([meal],true);await yes.start();yes.click('Diário');yes.render();await yes.click('Excluir registro');await new Promise(r=>setImmediate(r));
 assert.deepEqual(yes.removed,[{id:'m1',file:'u/foto.jpg'}]);
});
test('API apaga o arquivo do Storage só quando é do próprio usuário',async()=>{
 const calls=[];const root={PersonalProCloud:{userId:()=>'u',request:async(p,o={})=>{calls.push([p,o.method,o.body]);return []}},PersonalProSessionPreview:{adapt:x=>x}};
 vm.runInNewContext(read('portal-api.js'),{window:root,crypto:require('node:crypto')});const api=root.PersonalProAPI;
 await api.removeEntry('e1','u/foto.jpg');
 assert.deepEqual(calls.map(c=>c[0]+' '+c[1]),['/rest/v1/pp_nutrition_entries?id=eq.e1 DELETE','/storage/v1/object/pp-nutrition DELETE']);
 assert.deepEqual(JSON.parse(calls[1][2]),{prefixes:['u/foto.jpg']});
 calls.length=0;await api.removeEntry('e2');assert.equal(calls.length,1,'registro sem arquivo não chama o Storage');
 await assert.rejects(api.removeFile('outra/foto.jpg'),/outra conta/);
});

function trainerTools(linkRows,fail=false){
 let states=[],i=0,effects=[];const rpc=[];
 const root={PersonalProAPI:{uid:()=>'t1',rows:async(table,q)=>{if(fail)throw Error('x');assert.equal(table,'pp_links');assert.match(q,/legacy_student_id=eq.s1/);return linkRows},rpc:async(...a)=>{rpc.push(a);return 'tok'}},PersonalProCloud:{retry:async()=>{}},addEventListener(){},removeEventListener(){}};
 const ctx={window:root,location:{origin:'https://x',search:'',pathname:'/'},history:{replaceState(){}},navigator:{},setInterval,clearInterval,console};vm.runInNewContext(read('portal-app.js'),ctx);
 const R={Fragment:'f',createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],x=>states[n]=typeof x==='function'?x(states[n]):x]},useEffect(fn){effects.push(fn)}};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.children||[]):'';
 const render=()=>{i=0;effects=[];return text(root.PersonalProPortal.TrainerTools({React:R,studentId:'s1'}))};
 return {async run(){render();effects.forEach(f=>f());await new Promise(r=>setImmediate(r));return render()},rpc};
}
test('"Gerar convite" some para aluno já vinculado e continua para aluno sem vínculo',async()=>{
 const linked=await trainerTools([{student_user_id:'a1'}]).run();assert.ok(!linked.includes('Gerar convite'));assert.match(linked,/Aluno vinculado/);
 const open=await trainerTools([{student_user_id:null}]).run();assert.match(open,/Gerar convite do aluno/);
 const none=await trainerTools([]).run();assert.match(none,/Gerar convite do aluno/);
 const unknown=await trainerTools([],true).run();assert.match(unknown,/Gerar convite do aluno/,'falha na consulta não esconde o convite');
});

test('acessibilidade: crédito da imagem focável fora de aria-hidden, links sublinhados, tabela rolável focável',()=>{
 const app=read('portal-app.js');assert.ok(!app.includes('{ className: "portal-auth-art", "aria-hidden": true }'));
 assert.match(read('portal.css'),/\.portal-check a,\.portal-privacy a\{color:var\(--lime\);text-decoration:underline/);
 assert.match(read('portal.css'),/\.portal-legal-links\{display:flex;flex-wrap:wrap;gap:6px 6px/);
 assert.match(read('privacidade.html'),/class="legal-table-wrap" tabindex="0" role="region" aria-label=/);
});

const pngSize=f=>{const b=fs.readFileSync(path.join(base,f));assert.equal(b.subarray(1,4).toString(),'PNG');return [b.readUInt32BE(16),b.readUInt32BE(20)]};
test('ícones PNG 192, 512 e maskable no manifesto (preto e verde-limão)',()=>{
 const m=JSON.parse(read('manifest.webmanifest'));
 const byPurpose=p=>m.icons.filter(i=>i.type==='image/png'&&i.purpose===p);
 assert.deepEqual(byPurpose('any').map(i=>i.sizes).sort(),['192x192','512x512']);assert.deepEqual(byPurpose('maskable').map(i=>i.sizes),['512x512']);
 for(const i of m.icons.filter(i=>i.type==='image/png')){const [w,h]=pngSize(i.src.slice(1));assert.equal(w+'x'+h,i.sizes)}
 assert.deepEqual(pngSize('assets/icons/apple-touch-icon-180.png'),[180,180]);assert.match(read('index.html'),/rel="apple-touch-icon" href="\/assets\/icons\/apple-touch-icon-180.png"/);
});

test('PDF do treino: cabeçalho preto e verde-limão, carga com vírgula e 1ª página aproveitada',()=>{
 const jspdf=require('../vendor/jspdf-4.2.1.umd.min.js');const env={jspdf};vm.runInNewContext(read('workout-pdf.js'),{window:env});
 const ex=(n,day='A')=>({name:'Exercício '+n,series:'3',repetitions:'10',load:'7.5 kg',rest:60,day});
 const student={name:'Aluno Teste',workout:[ex(1),ex(2),ex(3),ex(4,'B')]};
 for(const mobile of [true,false]){const doc=env.PersonalProPDF.makeDocument(student,{name:'Personal'},new Date(2026,10,11),{mobile});const first=doc.internal.pages[1].join('\n');
  assert.match(first,/0\.04 0\.06 0\.05 rg/,'faixa preta #0b0f0c');assert.match(first,/(0\.77 0\.95 0\.42|0\.769 0\.953 0\.42) rg/,'detalhe verde-limão #c4f36b');
  assert.ok(first.includes('7,5 kg'));assert.ok(!first.includes('7.5 kg'));
  for(const n of [1,2,3])assert.ok(first.includes('Exercício '+n),'Treino A inteiro cabe na 1ª página ('+(mobile?'celular':'A4')+')');}
});

test('build não publica a prévia interna do PAR-Q',()=>{
 const {build}=require('../scripts/build-public.cjs');build();
 assert.ok(!fs.existsSync(path.join(base,'dist','parq-preview.html')));
 for(const f of ['index.html','format-br.js','manifest.webmanifest','assets/icons/icon-512.png','assets/icons/icon-maskable-512.png'])assert.ok(fs.existsSync(path.join(base,'dist',f)),f);
});

// Exclusão de conta (personal e aluno usam a mesma tela e o mesmo PersonalProCloud.deleteAccount).
function cloudHarness(handler){const calls=[];const memory=new Map();const ctx={window:{dispatchEvent(){}},Event:class{},AbortSignal,Date,JSON,URLSearchParams,location:{hash:'',origin:'https://preview.example',pathname:'/',search:''},history:{replaceState(){}},
 sessionStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},
 fetch:async(url,options={})=>{calls.push({url,method:options.method||'GET',body:options.body});const [status,data]=await handler(url,options,calls);return {ok:status<400,status,text:async()=>JSON.stringify(data)}}};
 vm.runInNewContext(read('cloud.js'),ctx);return {api:ctx.window.PersonalProCloud,calls};}
const owner={id:'22222222-2222-4222-8222-222222222222'},tok={user:owner,access_token:'t',refresh_token:'r',expires_in:3600};
function deletion({list,del,rpc}){return cloudHarness(async(url,o,calls)=>{if(url.includes('/token'))return [200,tok];if(url.endsWith('/user'))return [200,owner];if(url.includes('personal_pro_accounts'))return [200,[]];
 if(url.includes('pp_delete_my_account'))return JSON.parse(o.body).dry_run?[200,{deleted:false}]:(rpc?rpc():[200,{deleted:true}]);
 if(url.includes('/object/list/'))return list(JSON.parse(o.body),calls);if(url.includes('/storage/'))return del?del(JSON.parse(o.body)):[200,[]];return [200,[]]});}
const finalCall=calls=>calls.some(c=>c.url.includes('pp_delete_my_account')&&c.body==='{"dry_run":false}');
test('exclusão de conta apaga todos os arquivos da pasta do próprio usuário (com paginação) antes da função',async()=>{
 let gone=false;const deleted=[];
 const files=Array.from({length:1203},(_,i)=>({name:'f'+i+'.jpg',id:String(i)}));
 const {api,calls}=deletion({list:b=>{assert.equal(b.prefix,owner.id);return [200,gone?[]:files.slice(b.offset,b.offset+b.limit)]},del:b=>{deleted.push(...b.prefixes);if(deleted.length===files.length)gone=true;return [200,[]]}});
 await api.signIn('a@b.com','x');const r=await api.deleteAccount({confirm:true});assert.equal(r.deleted,true);
 assert.equal(deleted.length,1203);assert.ok(deleted.every(p=>p.startsWith(owner.id+'/')),'só a pasta auth.uid()');
 const lastDelete=calls.map(c=>c.url).lastIndexOf(calls.filter(c=>c.method==='DELETE').at(-1).url),rpcIndex=calls.findIndex(c=>c.url.includes('pp_delete_my_account')&&c.body==='{"dry_run":false}');
 assert.ok(lastDelete<rpcIndex,'arquivos saem antes da função');
});
test('falhas no Storage param a exclusão com mensagem em português',async()=>{
 for(const [label,opts,pattern] of [
  ['listar',{list:()=>[500,{message:'boom'}]},/Não foi possível conferir suas fotos e PDFs de nutrição\. Sua conta não foi excluída/],
  ['apagar',{list:()=>[200,[{name:'a.jpg',id:'1'}]],del:()=>[500,{message:'boom'}]},/Não foi possível apagar suas fotos e PDFs de nutrição\. Sua conta não foi excluída/],
  ['sobrou arquivo',{list:()=>[200,[{name:'a.jpg',id:'1'}]]},/Algumas fotos ou PDFs de nutrição não foram apagados/],
  ['servidor recusou',{list:()=>[200,[]],rpc:()=>[400,{code:'P0001',message:'storage_files_pending',hint:'Apague os arquivos'}]},/Ainda há fotos ou PDFs de nutrição na sua conta/]]){
  const {api,calls}=deletion(opts);await api.signIn('a@b.com','x');
  await assert.rejects(api.deleteAccount({confirm:true}),pattern,label);
  if(label!=='servidor recusou')assert.ok(!finalCall(calls),label+': função de exclusão não chamada');
  assert.ok(api.userId(),label+': sessão continua ativa');
 }
});
