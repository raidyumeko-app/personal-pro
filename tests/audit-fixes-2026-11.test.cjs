// Correções da auditoria de 10/11/2026 (itens que não envolvem vídeos).
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const base=path.join(__dirname,'..');const read=f=>fs.readFileSync(path.join(base,f),'utf8');

function sections(){const root={PersonalProSchedule:{today:()=>'2026-11-10',validDate:v=>/^\d{4}-\d{2}-\d{2}$/.test(v)}};vm.runInNewContext(read('student-sections.js'),{window:root,globalThis:root});return root.PersonalProStudentSections;}
function cloud(handler){const calls=[];const memory=new Map();const ctx={window:{dispatchEvent(){}},Event:class{},AbortSignal,Date,JSON,URLSearchParams,location:{hash:'',origin:'https://preview.example',pathname:'/',search:''},history:{replaceState(){}},
 sessionStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},
 fetch:async(url,options={})=>{calls.push({url,method:options.method||'GET',body:options.body});const [status,data]=await handler(url,options);return {ok:status<400,status,text:async()=>JSON.stringify(data)}}};
 vm.runInNewContext(read('cloud.js'),ctx);return {api:ctx.window.PersonalProCloud,calls};}
const user={id:'11111111-1111-4111-8111-111111111111'};const token={user,access_token:'t',refresh_token:'r',expires_in:3600};

test('mensagens de login, cadastro e recuperação em português',async()=>{
 const {api}=cloud(async()=>[400,{}]);const t=api.translateError;
 assert.equal(t({code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'}),'E-mail ou senha incorretos.');
 assert.equal(t({error:'invalid_grant',error_description:'Invalid login credentials'}),'E-mail ou senha incorretos.');
 assert.equal(t({code:400,error_code:'email_address_invalid',msg:'Email address "x@example.com" is invalid'}),'Este e-mail não é válido. Confira o endereço digitado.');
 assert.equal(t({msg:'User already registered'}),'Já existe uma conta com este e-mail. Entre ou recupere a senha.');
 assert.match(t({error_code:'weak_password',msg:'Password should be at least 6 characters.'}),/^Senha fraca/);
 assert.match(t({error_code:'over_email_send_rate_limit',msg:'email rate limit exceeded'}),/Limite de e-mails/);
 assert.equal(t({msg:'Something unexpected is not working'}),'Não foi possível concluir. Tente novamente em instantes.');
 assert.equal(t({message:'Sem conexão'}),'Sem conexão');
 const failing=cloud(async()=>[400,{code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'}]);
 await assert.rejects(failing.api.signIn('a@b.com','x'),/E-mail ou senha incorretos/);
});

test('CSV do financeiro neutraliza fórmulas (= + - @ tab CR) e mantém números',()=>{
 const api=sections();
 const profile={financialEntries:[
  {id:'1',date:'2026-11-02',type:'expense',amount:50,category:'Outros',description:'-2+3 TESTE'},
  {id:'2',date:'2026-11-03',type:'expense',amount:10,category:'Outros',description:'=HYPERLINK("x")'},
  {id:'3',date:'2026-11-04',type:'expense',amount:10,category:'Outros',description:'@SUM(A1)'},
  {id:'4',date:'2026-11-05',type:'expense',amount:10,category:'Outros',description:'\tcmd'},
  {id:'5',date:'2026-11-06',type:'income',amount:150,category:'Outros',description:'Mensalidade'}]};
 const csv=api.financialReport(profile,'2026-11');const text=typeof csv==='string'?csv:csv.csv||csv.text||String(csv);
 for(const bad of ['"-2+3','"=HYPERLINK','"@SUM','"\tcmd'])assert.ok(!text.includes(bad),bad);
 assert.ok(text.includes("\"'-2+3 TESTE\""));assert.ok(text.includes("\"'=HYPERLINK"));
 assert.ok(text.includes('"50,00"'),'valores numéricos não recebem apóstrofo');
});

test('recebimento vinculado ao aluno abate o pendente',()=>{
 const api=sections();
 const student={id:'s1',planValue:150,planStatus:'pendente'};
 assert.deepEqual({...api.financeSummary(student,[])},{pending:150,paid:0});
 const entries=[{id:'e',type:'income',studentId:'s1',amount:150,date:'2026-11-10'}];
 assert.deepEqual({...api.financeSummary(student,entries)},{pending:0,paid:150});
 assert.deepEqual({...api.financeSummary(student,[{...entries[0],amount:100}])},{pending:50,paid:100});
 assert.deepEqual({...api.financeSummary(student,[{...entries[0],date:'2026-10-10'}])},{pending:150,paid:0},'recebimento de outro mês não abate a mensalidade atual');
 assert.deepEqual({...api.financeSummary({...student,planStatus:'pago'},[])},{pending:0,paid:150});
 const withContract={id:'s2',servicePackages:[{id:'c1',amount:300,paymentStatus:'pending'}]};
 const v=api.financeSummary(withContract,[{type:'income',studentId:'s2',contractId:'c1',amount:120,date:'2026-11-01'}]);
 assert.equal(v.pending,180);assert.equal(v.paid,120);
 assert.ok(!read('student-sections.js').includes("useState('Gasolina')"),'categoria de despesa não começa em Gasolina');
});

test('build publica só os arquivos do app',()=>{
 const {build}=require('../scripts/build-public.cjs');build();
 const dist=path.join(base,'dist');const exists=f=>fs.existsSync(path.join(dist,f));
 for(const f of ['index.html','cloud.js','app.css','exercise-library.json','account-deletion.js','docs/compatibility/exercise-source-archive.json','vendor/jspdf-4.2.1.umd.min.js','media/profiles'])assert.ok(exists(f),f);
 for(const f of ['docs/evidence','tests','supabase','scripts','schema.sql','AUDITORIA-PREVIEW.md','README.md','vercel.json','.git','.gitignore','api'])assert.ok(!exists(f),f);
 const config=JSON.parse(read('vercel.json'));assert.equal(config.outputDirectory,'dist');assert.match(config.buildCommand,/build-public/);
});

test('botão interno de revisão só aparece com ?revisao=1',()=>{
 const html=read('index.html');
 assert.ok(!html.includes('<a href="/videos-gerados.html" id="pp-generated-review-link"'),'sem link fixo no HTML');
 assert.match(html,/q\.get\("revisao"\)==="1"/);assert.ok(!/z-index:2147483000/.test(html));
});

test('datas dd/mm e números com vírgula na evolução do aluno; semana marca treino concluído',()=>{
 const src=read('portal-app.js');
 assert.ok(!src.includes('String(v.date).slice(5, 10).replace("-", "/")'));
 const ctx={};vm.createContext(ctx);
 const start=src.indexOf('  const decimal = (value) =>'),end=src.indexOf('  function Spark(');
 vm.runInContext(src.slice(start,end)+';globalThis.f={decimal,shortDate,localDay};',ctx);
 assert.equal(ctx.f.decimal(72.5),'72,5');assert.equal(ctx.f.decimal('40'),'40');
 assert.equal(ctx.f.shortDate('2026-11-10'),'10/11');
 assert.equal(ctx.f.shortDate(new Date(2026,10,10,18,33).toISOString()),'10/11');
 assert.match(src,/concluído/);assert.match(src,/portal-week-done/);
});

test('exclusão de conta: sem a função no servidor nada é apagado',async()=>{
 const {api,calls}=cloud(async(url)=>{if(url.includes('/token'))return [200,token];if(url.endsWith('/user'))return [200,user];if(url.includes('personal_pro_accounts'))return [200,[]];if(url.includes('pp_delete_my_account'))return [404,{code:'PGRST202',message:'Could not find the function public.pp_delete_my_account'}];return [200,[]]});
 await api.signIn('a@b.com','x');
 await assert.rejects(api.deleteAccount({confirm:true}),err=>err.code==='deletion_unavailable'&&/Nada foi apagado/.test(err.message));
 assert.ok(!calls.some(c=>c.url.includes('/storage/')),'não toca no Storage');
 assert.ok(api.userId(),'sessão continua ativa');
});

test('exclusão de conta: prévia, arquivos do Storage e depois a função',async()=>{
 const {api,calls}=cloud(async(url,o)=>{if(url.includes('/token'))return [200,token];if(url.endsWith('/user'))return [200,user];if(url.includes('personal_pro_accounts'))return [200,[]];
  if(url.includes('pp_delete_my_account'))return [200,{deleted:JSON.parse(o.body).dry_run===false}];
  if(url.includes('/object/list/'))return [200,[{name:'a.jpg',id:'1'},{name:'b.pdf',id:'2'}]];if(url.includes('/storage/'))return [200,[]];return [200,[]]});
 await api.signIn('a@b.com','x');
 const preview=await api.deleteAccount();assert.equal(preview.deleted,false);assert.ok(!calls.some(c=>c.url.includes('/storage/')));
 const result=await api.deleteAccount({confirm:true});assert.equal(result.deleted,true);
 const order=calls.filter(c=>/pp_delete_my_account|storage/.test(c.url)).map(c=>c.url.replace(/^.*\/(rest|storage)\/v1/,'$1')+' '+(c.body||''));
 assert.deepEqual(order.slice(1),['rest/rpc/pp_delete_my_account {"dry_run":true}','storage/object/list/pp-nutrition {"prefix":"'+user.id+'","limit":1000,"offset":0}','storage/object/pp-nutrition {"prefixes":["'+user.id+'/a.jpg","'+user.id+'/b.pdf"]}','rest/rpc/pp_delete_my_account {"dry_run":false}']);
 assert.equal(api.userId(),undefined,'sessão encerrada');
 const sql=read('supabase/pending/20261110220000_account_self_deletion.sql');
 assert.match(sql,/security definer/);assert.match(sql,/set search_path = ''/);assert.match(sql,/storage_files_pending/);assert.match(sql,/delete from auth\.users where id = me/);
});
