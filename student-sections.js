/* Focused student work areas. Values are persisted through the existing account adapter. */
(function(root){'use strict';
const money=n=>(Number(n)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),packages=s=>Array.isArray(s.servicePackages)?s.servicePackages:[],weights=s=>Array.isArray(s.weightHistory)?s.weightHistory:[];
const dateLabel=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?value.split('-').reverse().join('/'):'Sem data registrada';
function serviceSummary(s,date=root.PersonalProSchedule.today()){const api=root.PersonalProSchedule,p=api.activePackage(s,date),last=p||api.latestPackage(s,date),next=[];for(let i=0;i<28&&!next.length;i++)next.push(...api.appointments(s,api.shift(date,i)).filter(a=>a.status==='scheduled'));const nextPackage=next[0]&&packages(s).find(item=>item.id===next[0].packageId),shown=nextPackage||last;return {package:shown,balance:shown?api.balance(s,shown):null,next:next[0]||null,expired:Boolean(shown?.end&&shown.end<date)}}
function financeSummary(s){const list=packages(s);return list.length?{pending:list.filter(p=>p.paymentStatus!=='paid').reduce((sum,p)=>sum+(Number(p.amount)||0),0),paid:list.filter(p=>p.paymentStatus==='paid').reduce((sum,p)=>sum+(Number(p.amount)||0),0)}:{pending:s.planStatus==='pago'?0:Number(s.planValue)||0,paid:s.planStatus==='pago'?Number(s.planValue)||0:0}}
function Assessment({React,student,onChange,notify}){
 const h=React.createElement,api=root.PersonalProSchedule,[weight,setWeight]=React.useState(''),[draft,setDraft]=React.useState({...student.measures});
 const labels={chest:'Peito',waist:'Cintura',hip:'Quadril',arm:'Braço',forearm:'Antebraço',thigh:'Coxa',calf:'Panturrilha'};
 const patch=fields=>onChange(student.id,s=>({...s,...fields}));
 const field=(label,value,fn,type='text',extra={})=>h('label',{className:'pp-field'},label,h('input',{'aria-label':label,type,value:value??'',onChange:e=>fn(e.target.value),...extra}));
 const w=weights(student);
 React.useEffect?.(()=>setDraft({...student.measures}),[student.id]);
 function saveMeasures(){const at=student.lastAssessmentDate||api.today();const values={};for(const [key,value] of Object.entries(draft)){if(value===''){values[key]='';continue}const n=Number(value);if(!Number.isFinite(n)||n<=0||n>400){notify('Confira a medida de '+(labels[key]||key)+'.');return}values[key]=n}
  onChange(student.id,s=>{const history=[...(s.measureHistory||[])],dates={...s.measureDates};for(const [region,value] of Object.entries(values)){const before=s.measures?.[region];if(before!==undefined&&before!==''&&Number(before)!==Number(value))history.push({date:s.measureDates?.[region]||s.lastAssessmentDate||null,region,value:Number(before)});if(value!=='')dates[region]=at;}return {...s,measures:values,measureDates:dates,measureHistory:history,lastAssessmentDate:at}});notify('Avaliação salva. Histórico preservado.');
 }
 return h('section',{className:'pp-focused-area','aria-label':'Avaliação e evolução do aluno'},
  h('h3',null,'Avaliação e evolução'),h('p',{className:'pp-hint'},'Registre uma nova avaliação sem apagar os valores anteriores.'),
  h('div',{className:'pp-form-columns'},
   field('Data da avaliação',student.lastAssessmentDate||'',v=>{if(!v||api.validDate(v)&&v<=api.today())patch({lastAssessmentDate:v});else notify('Escolha uma data válida até hoje.')},'date',{max:api.today()}),
   field('Altura (cm)',student.height,v=>{if(v===''||Number(v)>0&&Number(v)<=300)patch({height:v===''?'':Number(v)});else notify('Confira a altura.')},'number',{min:1,max:300,step:.1}),
   field('Objetivo do aluno',student.goal||'',v=>patch({goal:v.slice(0,200)}),'text',{maxLength:200}),
   h('label',{className:'pp-field'},'Limitações e cuidados',h('textarea',{'aria-label':'Limitações e cuidados',rows:3,maxLength:2000,value:student.limitation||'',onChange:e=>patch({limitation:e.target.value})}))
  ),
  h('section',{className:'pp-focused-block'},h('h4',null,'Peso corporal'),w.length?h('p',null,'Último registro: '+w.at(-1)+' kg'):h('p',{className:'pp-hint'},'Nenhum peso registrado.'),
   h('div',{className:'pp-inline-entry'},field('Novo peso (kg)',weight,setWeight,'number',{min:1,max:600,step:.1}),h('button',{type:'button',className:'pp-primary',onClick:()=>{const value=Number(weight);if(!Number.isFinite(value)||value<=0||value>600){notify('Informe um peso entre 0 e 600 kg.');return}const date=student.lastAssessmentDate||api.today();onChange(student.id,s=>({...s,weightHistory:[...weights(s),value],weightRecords:[...(s.weightRecords||weights(s).map(value=>({value,date:null}))),{value,date}],lastAssessmentDate:date}));setWeight('');notify('Peso registrado')}},'Registrar peso')),
   h('details',null,h('summary',null,'Histórico de peso ('+w.length+')'),h('ol',{className:'pp-weight-history'},w.map((value,index)=>h('li',{key:index},'Registro '+(index+1)+': '+value+' kg'+(student.weightRecords?.[index]?.date?' · '+dateLabel(student.weightRecords[index].date):'')))))
  ),
  h('section',{className:'pp-focused-block'},h('h4',null,'Medidas em centímetros'),h('div',{className:'pp-form-columns'},Object.entries(labels).map(([key,label])=>h('div',{key},field(label+' (cm)',draft[key],v=>setDraft(d=>({...d,[key]:v})),'number',{min:1,max:400,step:.1})))),h('button',{type:'button',className:'pp-primary',onClick:saveMeasures},'Salvar avaliação')),
  h('section',{className:'pp-focused-block'},h('h4',null,'Dobras cutâneas (mm)'),h('p',{className:'pp-hint'},'Pollock 3 e 7. Preencha o que medir.'),h('div',{className:'pp-form-columns'},['chest','abdomen','thigh','triceps','suprailiac','subscapular','midaxillary'].map(key=>field((({chest:'Peito',abdomen:'Abdômen',thigh:'Coxa',triceps:'Tríceps',suprailiac:'Supra-ilíaca',subscapular:'Subescapular',midaxillary:'Axilar média'})[key])+' (mm)',student.skinfolds?.[key],v=>onChange(student.id,s=>({...s,skinfolds:{...(s.skinfolds||{}),[key]:v===''?'':Number(v)}})),'number',{min:0,max:80,step:.1})))),
  h('section',{className:'pp-focused-block'},h('h4',null,'Bioimpedância'),h('div',{className:'pp-form-columns'},field('% Gordura',student.bioimpedance?.bodyFat,v=>onChange(student.id,s=>({...s,bioimpedance:{...(s.bioimpedance||{}),bodyFat:v===''?'':Number(v)}})),'number',{min:0,max:60,step:.1}),field('Massa muscular (kg)',student.bioimpedance?.muscleMass,v=>onChange(student.id,s=>({...s,bioimpedance:{...(s.bioimpedance||{}),muscleMass:v===''?'':Number(v)}})),'number',{min:0,max:100,step:.1}),field('Gordura visceral',student.bioimpedance?.visceralFat,v=>onChange(student.id,s=>({...s,bioimpedance:{...(s.bioimpedance||{}),visceralFat:v===''?'':Number(v)}})),'number',{min:0,max:30,step:1}))),
  h('p',{className:'pp-hint'},'Peso, medidas e observações de avaliação não entram no PDF do treino.'),h('details',{className:'pp-measure-history'},h('summary',null,'Histórico de medidas ('+(student.measureHistory||[]).length+')'),h('ol',null,(student.measureHistory||[]).slice().reverse().map((entry,i)=>h('li',{key:i},(labels[entry.region]||entry.region)+': '+entry.value+' cm · '+dateLabel(entry.date)))))
 );
}
// ... rest of file unchanged for this commit (full file should be restored if truncated)
root.PersonalProStudentSections={Assessment};
})(typeof window==='object'?window:globalThis);
