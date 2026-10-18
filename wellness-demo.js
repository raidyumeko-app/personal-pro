/* Demo-only nutrition education and exercise-video licensing status. */
(function(root){'use strict';
function Panel(props){const R=props.React||root.React;const el=(tag,attrs,...children)=>R.createElement(tag,attrs,...children);
 const [water,setWater]=R.useState(4),[meals,setMeals]=R.useState(3),[notes,setNotes]=R.useState('');
 return el('section',{className:'pp-wellness-panel','aria-label':'Nutrição e hábitos na demonstração'},
 el('h2',null,'Nutrição e hábitos'),el('p',null,'Área demonstrativa de acompanhamento. Os dados abaixo são fictícios e não são salvos.'),
 el('div',{className:'pp-wellness-stats'},
 el('label',null,'Copos de água registrados',el('input',{type:'number',min:0,max:30,value:water,onChange:e=>setWater(Math.max(0,Math.min(30,Number(e.target.value)||0)))})),
 el('label',null,'Refeições registradas',el('input',{type:'number',min:0,max:15,value:meals,onChange:e=>setMeals(Math.max(0,Math.min(15,Number(e.target.value)||0)))}))),
 el('label',null,'Observações sobre hábitos',el('textarea',{rows:3,value:notes,placeholder:'Ex.: rotina de refeições, preferências, dificuldades...',onChange:e=>setNotes(e.target.value)})),
 el('p',{className:'pp-hint'},'O personal acompanha hábitos e pode encaminhar o aluno a um nutricionista. Não há prescrição de dietas, calorias ou suplementos nesta demonstração.'),
 el('button',{type:'button',className:'pp-secondary',onClick:()=>{setWater(4);setMeals(3);setNotes('')}},'Reiniciar exemplo'));
}
function Videos(props){const R=props.React||root.React;const el=(tag,attrs,...children)=>R.createElement(tag,attrs,...children);return el('section',{className:'pp-wellness-panel','aria-label':'Vídeos de exercícios'},
el('h2',null,'Vídeos de exercícios'),el('p',null,'Os exercícios da biblioteca podem ter vídeos demonstrativos, mas só exibiremos vídeos com licença de uso e revisão técnica confirmadas.'),
el('p',{className:'pp-hint'},'Ainda não há um catálogo de vídeos aprovado para reprodução. Fotos e instruções existentes continuam disponíveis; nenhum vídeo externo será apresentado como licenciado sem verificação.'));
}

function Experience(props){
 const R=props.React||root.React,el=(t,p,...ch)=>R.createElement(t,p,...ch);
 const initial={A:[{name:'Agachamento livre',sets:3,reps:12,rest:60},{name:'Supino reto',sets:3,reps:10,rest:75},{name:'Remada baixa',sets:3,reps:12,rest:60}],B:[{name:'Leg press',sets:4,reps:10,rest:75},{name:'Desenvolvimento',sets:3,reps:12,rest:60},{name:'Puxada frontal',sets:3,reps:12,rest:60}]};
 const [role,setRole]=R.useState('trainer'),[day,setDay]=R.useState('A'),[workouts,setWorkouts]=R.useState(initial),[done,setDone]=R.useState({}),[logs,setLogs]=R.useState({}),[history,setHistory]=R.useState([]),[editing,setEditing]=R.useState(-1),[newName,setNewName]=R.useState(''),[notice,setNotice]=R.useState('');
 const exercises=workouts[day],key=i=>day+':'+i,completed=exercises.filter((_,i)=>done[key(i)]).length;
 const tile=(title,value,note)=>el('div',{className:'pp-exp-tile'},el('small',null,title),el('strong',null,value),el('span',null,note));
 const button=(label,selected,fn)=>el('button',{type:'button',className:'pp-exp-pill'+(selected?' is-active':''),onClick:fn},label);
 const edit=(i,patch)=>setWorkouts(old=>({...old,[day]:old[day].map((x,j)=>j===i?{...x,...patch}:x)}));
 const input=(label,value,onChange,type='number')=>el('label',{className:'pp-exp-field'},el('span',null,label),el('input',{type,min:type==='number'?0:undefined,value,onChange:e=>onChange(type==='number'?Math.max(0,Math.min(999,Number(e.target.value)||0)):e.target.value)}));
 const switchDay=d=>{setDay(d);setEditing(-1);setNotice('')};
 const finish=()=>{if(completed!==exercises.length){setNotice('Conclua os exercícios antes de finalizar.');return}setHistory(h=>[{id:Date.now(),day,date:new Date().toLocaleDateString('pt-BR'),exercises:exercises.map((x,i)=>({name:x.name,weight:logs[key(i)]?.weight||0,reps:logs[key(i)]?.reps||x.reps}))},...h].slice(0,20));setNotice('Treino registrado nesta demonstração.');setDone(d=>Object.fromEntries(Object.entries(d).filter(([k])=>!k.startsWith(day+':'))))};
 return el('section',{className:'pp-exp','aria-label':'Experiência visual profissional e aluno'},
 el('header',{className:'pp-exp-head'},el('div',null,el('span',{className:'pp-exp-kicker'},'PERSONAL PRO · EXPERIÊNCIA'),el('h2',null,role==='trainer'?'Seu estúdio. Em movimento.':'Seu progresso começa aqui.'),el('p',null,role==='trainer'?'Gerencie alunos e treinos com clareza.':'Acompanhe seu treino, registre cada série e evolua.')),el('span',{className:'pp-exp-symbol','aria-hidden':true},'↗')),
 el('div',{className:'pp-exp-switch'},button('Visão do profissional',role==='trainer',()=>{setRole('trainer');setNotice('')}),button('Visão do aluno',role==='student',()=>{setRole('student');setNotice('')})),
 role==='trainer'?el(R.Fragment,null,
 el('div',{className:'pp-exp-metrics'},tile('Alunos ativos','24','Exemplo fictício'),tile('Treinos na semana','86','Exemplo fictício'),tile('Acompanhamento','92%','Exemplo fictício')),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Visão do dia'),el('span',null,'DEMONSTRAÇÃO')),el('div',{className:'pp-exp-person'},el('div',{className:'pp-exp-avatar'},'MC'),el('div',null,el('strong',null,'Marina Costa'),el('p',null,'Treino A · adaptação')),el('span',{className:'pp-exp-tag'},'Em dia')),el('div',{className:'pp-exp-person'},el('div',{className:'pp-exp-avatar'},'RL'),el('div',null,el('strong',null,'Rafael Lima'),el('p',null,'Treino B · força')),el('span',{className:'pp-exp-tag'},'Hoje'))),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Montagem rápida'),el('span',null,'EDITOR DEMO')),el('p',{className:'pp-exp-muted'},'Edite exercícios, séries, repetições e descanso. As alterações aparecem imediatamente na visão do aluno.'),el('div',{className:'pp-exp-switch'},button('Treino A',day==='A',()=>switchDay('A')),button('Treino B',day==='B',()=>switchDay('B'))),
 ...exercises.map((ex,i)=>el('div',{className:'pp-exp-edit',key:key(i)},el('div',{className:'pp-exp-exercise'},el('span',{className:'pp-exp-number'},String(i+1).padStart(2,'0')),el('div',null,el('strong',null,ex.name),el('p',null,ex.sets+' × '+ex.reps+' · '+ex.rest+'s de descanso')),el('button',{type:'button',className:'pp-exp-action',onClick:()=>setEditing(editing===i?-1:i)},editing===i?'Fechar':'Editar')),
 editing===i&&el('div',{className:'pp-exp-editor'},input('Exercício',ex.name,v=>edit(i,{name:v}),'text'),input('Séries',ex.sets,v=>edit(i,{sets:v})),input('Repetições',ex.reps,v=>edit(i,{reps:v})),input('Descanso (s)',ex.rest,v=>edit(i,{rest:v})),el('button',{type:'button',className:'pp-exp-action',onClick:()=>{setWorkouts(w=>({...w,[day]:w[day].filter((_,j)=>j!==i)}));setDone({});setLogs({});setEditing(-1)}},'Remover exercício')))),
 el('div',{className:'pp-exp-add'},el('input',{type:'text',maxLength:80,placeholder:'Nome do novo exercício',value:newName,onChange:e=>setNewName(e.target.value)}),el('button',{type:'button',className:'pp-exp-action',disabled:!newName.trim()||exercises.length>=15,onClick:()=>{setWorkouts(w=>({...w,[day]:[...w[day],{name:newName.trim(),sets:3,reps:12,rest:60}]}));setNewName('')}},'+ Adicionar')),
 el('button',{type:'button',className:'pp-exp-action',onClick:()=>{setWorkouts(w=>({...w,[day==='A'?'B':'A']:w[day].map(x=>({...x}))}));setNotice('Treino copiado para o outro dia (demonstração).')}},'Copiar este treino para '+(day==='A'?'B':'A')))),
 el(R.Fragment,null,
 el('div',{className:'pp-exp-hero'},el('span',null,'SEU TREINO DE HOJE'),el('h3',null,'Construa sua melhor versão.'),el('p',null,'Treino '+day+' · '+exercises.length+' exercícios'),el('div',{className:'pp-exp-switch'},button('Treino A',day==='A',()=>switchDay('A')),button('Treino B',day==='B',()=>switchDay('B')))),
 el('div',{className:'pp-exp-metrics'},tile('Sessões',String(history.length),'Nesta demonstração'),tile('Exercícios',String(exercises.length),'No treino '+day),tile('Concluídos',completed+'/'+exercises.length,'Neste treino')),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Execução do treino'),el('span',null,'REGISTRO DEMO')),
 ...exercises.map((ex,i)=>el('div',{className:'pp-exp-edit',key:key(i)},el('div',{className:'pp-exp-exercise'},el('span',{className:'pp-exp-number'},String(i+1).padStart(2,'0')),el('div',null,el('strong',null,ex.name),el('p',null,ex.sets+' × '+ex.reps+' · Descanso '+ex.rest+'s')),el('button',{type:'button',className:'pp-exp-check'+(done[key(i)]?' is-done':''),'aria-label':(done[key(i)]?'Desmarcar ':'Concluir ')+ex.name,onClick:()=>setDone(v=>({...v,[key(i)]:!v[key(i)]}))},done[key(i)]?'✓':'○')),
 el('div',{className:'pp-exp-editor'},input('Carga (kg)',logs[key(i)]?.weight??0,v=>setLogs(old=>({...old,[key(i)]:{...old[key(i)],weight:v}}))),input('Repetições feitas',logs[key(i)]?.reps??ex.reps,v=>setLogs(old=>({...old,[key(i)]:{...old[key(i)],reps:v}})))))),
 el('button',{type:'button',className:'pp-exp-finish',disabled:!exercises.length,onClick:finish},'Finalizar treino ('+completed+'/'+exercises.length+')')),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Histórico'),el('span',null,'LOCAL · DEMO')),history.length?history.map(h=>el('div',{className:'pp-exp-exercise',key:h.id},el('span',{className:'pp-exp-number'},h.day),el('div',null,el('strong',null,'Treino '+h.day+' · '+h.date),el('p',null,h.exercises.length+' exercícios registrados')))):el('p',{className:'pp-exp-muted'},'Finalize um treino para ver o registro aqui.'))),
 notice&&el('p',{className:'pp-exp-notice',role:'status'},notice),
 el('p',{className:'pp-exp-disclaimer'},'Demonstração interativa com dados fictícios. Alterações e histórico existem somente nesta tela enquanto estiver aberta; não são gravados no Supabase, não há acesso autenticado do aluno.'));
}
root.PersonalProExperience={Experience};

root.PersonalProWellnessDemo={Panel,Videos};})(window);
