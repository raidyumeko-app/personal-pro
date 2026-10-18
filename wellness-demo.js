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
 const [role,setRole]=R.useState('trainer'),[day,setDay]=R.useState('A'),[done,setDone]=R.useState({}),[active,setActive]=R.useState('inicio');
 const workouts={A:[['Agachamento livre','3 × 12','60 s'],['Supino reto','3 × 10','75 s'],['Remada baixa','3 × 12','60 s']],B:[['Leg press','4 × 10','75 s'],['Desenvolvimento','3 × 12','60 s'],['Puxada frontal','3 × 12','60 s']]};
 const tile=(title,value,note)=>el('div',{className:'pp-exp-tile'},el('small',null,title),el('strong',null,value),el('span',null,note));
 const button=(label,selected,fn)=>el('button',{type:'button',className:'pp-exp-pill'+(selected?' is-active':''),onClick:fn},label);
 return el('section',{className:'pp-exp','aria-label':'Experiência visual profissional e aluno'},
 el('header',{className:'pp-exp-head'},el('div',null,el('span',{className:'pp-exp-kicker'},'PERSONAL PRO · EXPERIÊNCIA'),el('h2',null,role==='trainer'?'Seu estúdio. Em movimento.':'Seu progresso começa aqui.'),el('p',null,role==='trainer'?'Gerencie alunos e treinos com clareza.':'Acompanhe seu treino, registre cada série e evolua.')),el('span',{className:'pp-exp-symbol','aria-hidden':true},'↗')),
 el('div',{className:'pp-exp-switch'},button('Visão do profissional',role==='trainer',()=>{setRole('trainer');setActive('inicio')}),button('Visão do aluno',role==='student',()=>{setRole('student');setActive('inicio')})),
 role==='trainer'?el(R.Fragment,null,
 el('div',{className:'pp-exp-metrics'},tile('Alunos ativos','24','Exemplo fictício'),tile('Treinos na semana','86','Exemplo fictício'),tile('Acompanhamento','92%','Exemplo fictício')),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Visão do dia'),el('span',null,'DEMONSTRAÇÃO')),el('div',{className:'pp-exp-person'},el('div',{className:'pp-exp-avatar'},'MC'),el('div',null,el('strong',null,'Marina Costa'),el('p',null,'Treino A · adaptação')),el('span',{className:'pp-exp-tag'},'Em dia')),el('div',{className:'pp-exp-person'},el('div',{className:'pp-exp-avatar'},'RL'),el('div',null,el('strong',null,'Rafael Lima'),el('p',null,'Treino B · força')),el('span',{className:'pp-exp-tag'},'Hoje'))),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Montagem rápida'),el('span',null,'PRÉVIA')),el('p',{className:'pp-exp-muted'},'Selecione um modelo para visualizar a sequência. A edição real continua na área de treinos do profissional.'),el('div',{className:'pp-exp-switch'},button('Treino A',day==='A',()=>setDay('A')),button('Treino B',day==='B',()=>setDay('B'))),...workouts[day].map((ex,i)=>el('div',{className:'pp-exp-exercise',key:day+i},el('span',{className:'pp-exp-number'},String(i+1).padStart(2,'0')),el('div',null,el('strong',null,ex[0]),el('p',null,ex[1]+' · Descanso '+ex[2])))))),
 el(R.Fragment,null,
 el('div',{className:'pp-exp-hero'},el('span',null,'SEU TREINO DE HOJE'),el('h3',null,'Construa sua melhor versão.'),el('p',null,'Treino '+day+' · '+workouts[day].length+' exercícios'),el('div',{className:'pp-exp-switch'},button('Treino A',day==='A',()=>setDay('A')),button('Treino B',day==='B',()=>setDay('B')))),
 el('div',{className:'pp-exp-metrics'},tile('Sessões','12','Neste mês · exemplo'),tile('Sequência','4 dias','Exemplo fictício'),tile('Concluídos',Object.keys(done).filter(k=>k.startsWith(day)).filter(k=>done[k]).length+'/'+workouts[day].length,'Neste treino')),
 el('div',{className:'pp-exp-section'},el('div',{className:'pp-exp-title'},el('h3',null,'Exercícios'),el('span',null,'REGISTRO DEMO')),...workouts[day].map((ex,i)=>el('div',{className:'pp-exp-exercise',key:day+i},el('span',{className:'pp-exp-number'},String(i+1).padStart(2,'0')),el('div',null,el('strong',null,ex[0]),el('p',null,ex[1]+' · Descanso '+ex[2])),el('button',{type:'button',className:'pp-exp-check'+(done[day+i]?' is-done':''),'aria-label':(done[day+i]?'Desmarcar ':'Concluir ')+ex[0],onClick:()=>setDone(v=>({...v,[day+i]:!v[day+i]}))},done[day+i]?'✓':'○'))))),
 el('p',{className:'pp-exp-disclaimer'},'Prévia visual interativa com dados fictícios. Não salva informações, não representa portal do aluno autenticado e não altera treinos reais.'));
}
root.PersonalProExperience={Experience};

root.PersonalProWellnessDemo={Panel,Videos};})(window);
