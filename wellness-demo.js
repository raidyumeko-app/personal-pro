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
root.PersonalProWellnessDemo={Panel,Videos};})(window);
