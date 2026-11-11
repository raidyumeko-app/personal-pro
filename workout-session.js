/* Workout session engine. Pure functions; no network or media rights assumptions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PersonalProWorkoutSession=api})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const integer=(v,min,max)=>Number.isInteger(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):null;
function normalizeExercise(e){if(!e||typeof e!=='object'||!String(e.id||'').trim()||!String(e.name||'').trim())throw Error('Exercício inválido');
const sets=integer(e.sets??3,1,20),reps=integer(e.reps??10,1,100),restSeconds=integer(e.restSeconds??60,0,600);if(sets===null||reps===null||restSeconds===null)throw Error('Séries, repetições ou descanso inválidos');
return {id:String(e.id),name:String(e.name).slice(0,160),sets,reps,restSeconds,video:e.video&&e.video.licensed===true&&e.video.reviewed===true&&/^https:\/\//.test(e.video.url||'')?{url:e.video.url,licensed:true,reviewed:true}:null};}
function createSession({id,studentId,workoutId,exercises,at=new Date().toISOString()}){if(!id||!studentId||!workoutId||!Array.isArray(exercises)||!exercises.length||exercises.length>100)throw Error('Dados do treino incompletos');
const items=exercises.map(normalizeExercise);if(new Set(items.map(x=>x.id)).size!==items.length)throw Error('Exercícios duplicados');
return {id:String(id),studentId:String(studentId),workoutId:String(workoutId),startedAt:at,completedAt:null,exercises:items,logs:[]};}
function logSet(session,{exerciseId,setNumber,reps,weightKg,at=new Date().toISOString()}){if(session.completedAt)throw Error('Treino encerrado');
const exercise=session.exercises.find(x=>x.id===exerciseId);if(!exercise)throw Error('Exercício não pertence ao treino');
const n=integer(setNumber,1,exercise.sets),r=integer(reps,0,100),w=Number(weightKg);if(n===null||r===null||weightKg===null||weightKg===undefined||String(weightKg).trim()===''||!Number.isFinite(w)||w<0||w>1000)throw Error('Registro inválido');
return {...session,logs:[...session.logs.filter(l=>!(l.exerciseId===exerciseId&&l.setNumber===n)),{exerciseId,setNumber:n,reps:r,weightKg:w,at}]};}
function progress(session){const expected=session.exercises.reduce((s,e)=>s+e.sets,0);return {done:session.logs.length,expected,percent:Math.round(session.logs.length/expected*100)};}
function finish(session,at=new Date().toISOString()){if(session.completedAt)throw Error('Treino já encerrado');if(!session.logs.length)throw Error('Registre ao menos uma série');return {...session,completedAt:at};}
function previousLoad(sessions,studentId,exerciseId){const logs=(sessions||[]).filter(s=>s.studentId===studentId).flatMap(s=>(s.logs||[]).filter(l=>l.exerciseId===exerciseId));return logs.length?logs.sort((a,b)=>String(b.at).localeCompare(String(a.at)))[0].weightKg:null;}
const STALE_MS=3*60*60*1000,MAX_MINUTES=180,GAP_MS=60*60*1000;
const ms=v=>{const t=Date.parse(v);return Number.isFinite(t)?t:null;};
const sameLocalDay=(a,b)=>{const x=new Date(a),y=new Date(b);return x.getFullYear()===y.getFullYear()&&x.getMonth()===y.getMonth()&&x.getDate()===y.getDate();};
/* Treino aberto há mais de 3 h ou iniciado em outro dia: o app pergunta se o aluno quer recomeçar. */
function isStale(session,now=Date.now()){if(!session||session.completedAt)return false;const start=ms(session.startedAt);if(start===null)return false;return now-start>STALE_MS||!sameLocalDay(start,now);}
/* Duração realista: se o treino ficou aberto por horas, conta só o último bloco contínuo de séries
   (intervalos de até 60 min) e nunca passa de 180 min. Sem dado confiável, devolve null. */
function durationMinutes(session){if(!session)return null;const start=ms(session.startedAt),end=ms(session.completedAt);if(start===null||end===null||end<start)return null;
let from=start;if(end-start>STALE_MS||!sameLocalDay(start,end)){const times=(session.logs||[]).map(l=>ms(l&&l.at)).filter(t=>t!==null&&t<=end).sort((a,b)=>a-b);if(!times.length)return null;from=times[times.length-1];for(let i=times.length-1;i>0&&times[i]-times[i-1]<=GAP_MS;i--)from=times[i-1];if(end-from>GAP_MS*3)return null;}
return Math.min(MAX_MINUTES,Math.max(1,Math.round((end-from)/60000)));}
return {normalizeExercise,createSession,logSet,progress,finish,previousLoad,isStale,durationMinutes};});
