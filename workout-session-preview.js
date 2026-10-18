/* Personal Pro: trainer-only session simulator. Never persists student data. */
(function(root){'use strict';
function numberFrom(value,fallback){const match=String(value??'').match(/\d+/);return match?Number(match[0]):fallback;}
function adapt(exercises){return (Array.isArray(exercises)?exercises:[]).slice(0,100).map((item,index)=>({
 id:String(item.id||item.sourceId||'exercise')+'-'+index,
 name:String(item.name||'Exercício '+(index+1)),
 sets:Math.max(1,Math.min(20,numberFrom(item.series??item.sets,3))),
 reps:Math.max(1,Math.min(100,numberFrom(item.repetitions??item.reps,10))),
 restSeconds:Math.max(0,Math.min(600,numberFrom(item.rest,60)))
}));}
function Simulator(props){const R=root.React,engine=root.PersonalProWorkoutSession;
 const [session,setSession]=R.useState(null),[weights,setWeights]=R.useState({}),[error,setError]=R.useState('');
 const exercises=adapt(props.exercises),day=props.day||'A',studentId=String(props.studentId||'preview');
 function start(){try{setError('');setWeights({});setSession(engine.createSession({id:'preview-'+Date.now(),studentId,workoutId:'preview-'+day,exercises}));}catch(e){setError(e.message);}}
 function record(exercise,n){try{setError('');const key=exercise.id+':'+n;const raw=weights[key]??'0';if(String(raw).trim()==='')throw Error('Informe a carga em kg.');setSession(old=>engine.logSet(old,{exerciseId:exercise.id,setNumber:n,reps:exercise.reps,weightKg:raw}));}catch(e){setError(e.message);}}
 const el=(tag,attributes,...children)=>R.createElement(tag,attributes,...children);
 const reset=()=>{setSession(null);setWeights({});setError('');};
 return el('section',{className:'pp-session-preview','aria-label':'Simulador de execução do treino'},
 el('div',{className:'pp-session-preview-heading'},el('div',null,el('h3',null,'Simular execução · Treino '+day),el('p',null,'Teste séries e cargas antes de liberar o acesso do aluno. Simulação temporária: nada é salvo.')),el('button',{type:'button',className:'pp-secondary',onClick:session?reset:start,disabled:!exercises.length},session?'Reiniciar':'Iniciar simulação')),
 session&&el('div',null,el('p',{className:'pp-session-progress','aria-live':'polite'},'Séries registradas: '+engine.progress(session).done+' de '+engine.progress(session).expected+' · '+engine.progress(session).percent+'%'),
 el('progress',{value:engine.progress(session).done,max:engine.progress(session).expected,'aria-label':'Progresso do treino'}),
 ...session.exercises.map(ex=>el('div',{className:'pp-session-exercise',key:ex.id},
 el('strong',null,ex.name),el('small',null,ex.sets+' séries · '+ex.reps+' repetições · '+ex.restSeconds+'s descanso'),
 ...Array.from({length:ex.sets},(_,i)=>{const n=i+1,key=ex.id+':'+n,done=session.logs.some(l=>l.exerciseId===ex.id&&l.setNumber===n);return el('div',{className:'pp-session-set',key},
 el('label',null,'Série '+n+' · kg',el('input',{type:'number',min:'0',max:'1000',step:'0.5',inputMode:'decimal',disabled:!!session.completedAt,value:weights[key]??'0',onChange:e=>setWeights(old=>({...old,[key]:e.target.value}))})),
 el('button',{type:'button',className:done?'pp-secondary':'pp-primary',disabled:!!session.completedAt,onClick:()=>record(ex,n)},done?'Atualizar série':'Registrar série'));})
 )),
 el('button',{type:'button',className:'pp-primary',disabled:!!session.completedAt||!session.logs.length,onClick:()=>{try{setSession(old=>engine.finish(old));setError('');}catch(e){setError(e.message);}}},session.completedAt?'Simulação concluída':'Concluir simulação')),
 error&&el('p',{className:'pp-session-error',role:'alert'},error));}
root.PersonalProSessionPreview={Simulator,adapt};})(window);
