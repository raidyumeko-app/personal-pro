const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.join(__dirname,'..');
const source=readFileSync(path.join(base,'cloud.js'),'utf8');
const html=readFileSync(path.join(base,'index.html'),'utf8');
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  if(!match[1].includes('application/json')) new vm.Script(match[2]);
}
function setup(handler, hash='', memory=new Map()) {
 const calls=[];const historyCalls=[];
 const ctx={window:{},AbortSignal,Date,JSON,URLSearchParams,location:{hash,origin:'https://preview.example',pathname:'/',search:''},history:{replaceState(...args){historyCalls.push(args)}},
 sessionStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
 fetch:async(url,options)=>{calls.push({url,options});return handler(url,options)}};
 vm.runInNewContext(source,ctx);return {api:ctx.window.PersonalProCloud,calls,memory,historyCalls};
}
const response=(data,status=200)=>({ok:status<400,text:async()=>JSON.stringify(data)});
const user={id:'11111111-1111-4111-8111-111111111111'};
const token={user,access_token:'test-token',refresh_token:'test-refresh',expires_in:3600};
(async()=>{
 let saved;let fail=false;
 const t=setup(async(url,o)=>{
  if(url.includes('/token')) return response(token);
  if(url.endsWith('/user')) return response(user);
  if(url.includes('/personal_pro_accounts')) {
    if(o.method==='POST') {if(fail)return response({message:'Sem conexão'},503);saved=JSON.parse(o.body);return response([saved]);}
    return response(saved?[saved]:[]);
  }
  return response({});
 });
 assert.equal(await t.api.restore(),null);
 await assert.rejects(t.api.save({},[]),/Sessão ausente/);
 assert.equal((await t.api.signIn('test@example.invalid','not-a-real-password')).user.id,user.id);
 const students=[{id:'a1',name:'Aluno',workoutReviewDate:'2026-12-01',workoutUpdatedAt:'2026-10-17T12:00:00Z',workoutReviewedAt:'2026-10-16T12:00:00Z',notes:'Notas',doneOn:['2026-10-17'],planValue:99,workout:[{id:'w1',name:'Agachamento',sets:'3x12',load:'20kg',notes:'Carga leve',loadHistory:[{load:'15kg',at:'2026-10-16T12:00:00Z'},{load:'20kg',at:'2026-10-17T12:00:00Z'}]}]}];
 await t.api.save({name:'Coach',favoriteExercises:['Barbell_Squat'],workoutTemplates:[{id:'model1',name:'Minha ficha',preserveDays:true,exercises:[{name:'Agachamento',day:'B',series:'3',repetitions:'12',load:'20kg',notes:'Carga leve'}]}]},students);
 assert.deepEqual(saved.students,students);
 assert.equal(saved.user_id,user.id);
 assert.equal((await t.api.restore()).profile.name,'Coach');assert.equal((await t.api.restore()).profile.favoriteExercises[0],'Barbell_Squat');assert.equal((await t.api.restore()).students[0].workout[0].loadHistory.length,2);assert.equal((await t.api.restore()).profile.workoutTemplates[0].exercises[0].day,'B');assert.equal((await t.api.restore()).students[0].workoutReviewDate,'2026-12-01');
 await Promise.all([t.api.save({name:'Primeiro'},students),t.api.save({name:'Último'},students)]);
 assert.equal(saved.profile.name,'Último');
 assert.ok(t.calls.filter(c=>c.url.includes('/personal_pro_accounts')).every(c=>c.options.headers.Authorization==='Bearer test-token'));
 fail=true;await assert.rejects(t.api.save({},[]),/Sem conexão/);fail=false;
 await t.api.save({name:'Recuperado'},students);
 await t.api.signOut();assert.equal(await t.api.restore(),null);
 const bad=setup(()=>response({msg:'Credenciais inválidas'},400));
 await assert.rejects(bad.api.signIn('x','wrong'),/Credenciais inválidas/);
 const signup=setup(()=>response({user}));assert.equal(await signup.api.signUp('x','password'),null);
 const recovery=setup(()=>response(user),'#type=recovery&access_token=test&refresh_token=refresh&expires_in=3600');
 assert.deepEqual(await Promise.all([recovery.api.acceptRecovery(),recovery.api.acceptRecovery()]),[true,true]);
 assert.equal(recovery.calls.length,1);
 const confirmation=setup((url)=>response(url.endsWith('/user')?user:[]),'#type=signup&access_token=test&refresh_token=refresh&expires_in=3600');
 assert.equal(await confirmation.api.acceptRecovery(),false);
 assert.equal((await confirmation.api.restore()).user.id,user.id);
 assert.ok(confirmation.memory.get('personal-pro-session'));
 const reloaded=setup(()=>response(user),'',recovery.memory);
 assert.equal(await reloaded.api.acceptRecovery(),true,'Reload keeps the password form after removing URL tokens');
 assert.equal(reloaded.calls.length,1,'A persisted reset still validates the session with the server');
 assert.equal(recovery.historyCalls[0][2],'/','Tokens are removed from browser history');
 await reloaded.api.updatePassword('a-new-password');
 assert.equal(reloaded.calls.at(-1).options.method,'PUT');
 assert.deepEqual(JSON.parse(reloaded.calls.at(-1).options.body),{password:'a-new-password'});
 assert.equal(JSON.parse(reloaded.memory.get('personal-pro-session')).pending_password_reset,false);
 assert.equal(await setup(()=>response(user),'',reloaded.memory).api.acceptRecovery(),false,'Completed reset does not reopen');
 const failedReset=setup(()=>response({message:'Senha recusada'},422),'',new Map([['personal-pro-session',JSON.stringify({...token,pending_password_reset:true})]]));
 await assert.rejects(failedReset.api.updatePassword('bad'),/Senha recusada/);
 assert.equal(JSON.parse(failedReset.memory.get('personal-pro-session')).pending_password_reset,true,'Failed update allows retry');
 const expired=setup(()=>{throw Error('No request expected')},'#error=access_denied&error_code=otp_expired&error_description=untrusted');
 await assert.rejects(expired.api.acceptRecovery(),/inválido ou expirou/);
 assert.equal(expired.historyCalls.length,1);assert.equal(expired.calls.length,0);
 assert.equal(expired.memory.has('personal-pro-session'),false);
 const refused=setup(()=>response({message:'Sessão inválida'},401),'#type=recovery&access_token=invalid&refresh_token=r');
 await assert.rejects(refused.api.acceptRecovery(),/Sessão inválida/);
 assert.equal(refused.memory.has('personal-pro-session'),false,'Rejected callback never leaves a signed-in session');
 const refreshReset=setup(url=>response(url.includes('/token')?token:user),'',new Map([['personal-pro-session',JSON.stringify({...token,expires_at:1,pending_password_reset:true})]]));
 assert.equal(await refreshReset.api.acceptRecovery(),true);
 assert.equal(JSON.parse(refreshReset.memory.get('personal-pro-session')).pending_password_reset,true,'Refresh preserves pending reset');
 await refreshReset.api.signOut();assert.equal(refreshReset.memory.has('personal-pro-session'),false);
 const redirect=setup(()=>response({user}));await redirect.api.recover('test@example.invalid');
 assert.equal(new URL(redirect.calls[0].url).searchParams.get('redirect_to'),'https://preview.example/');
 console.log('PASS: recovery reload, verified session, completed/failed update, expired/rejected links, token refresh, logout and preview redirect.');
 console.log('PASS: email confirmation redirect restores the signed-in session.');
 console.log('PASS: JS syntax; login; owner-scoped save; full student fields; restore; ordered writes; failure/retry; logout; invalid credentials; email confirmation; recovery under duplicate React effects.');
})().catch(err=>{console.error(err);process.exitCode=1});
