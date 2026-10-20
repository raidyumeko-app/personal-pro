const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const code = html.slice(html.indexOf('const exerciseLibrary=') >= 0 ? html.indexOf('const exerciseLibrary=') : html.indexOf('function ua()'),html.indexOf('cd.createRoot('));
const states = [], refs = [];
let stateIndex = 0, refIndex = 0;
const sample = {id:'manual-test',name:'Aluno de teste',initials:'AT',color:'#D8FF2F',goal:'Treino',streak:0,lastCheckinDays:0,whatsapp:'5511999999999',limitation:'Nenhuma',height:'170',weightHistory:[],measures:{},notes:'',lastReval:0,monthlyFreq:'0/12',todayStatus:'pending',planValue:100,planStatus:'pago',workout:[],doneOn:[]};
let studentState;
const ctx = {console,Date,Set,JSON,Object,Array,Number,String,Math,
 R:{
  useState(initial){const i=stateIndex++;if(!(i in states)){states[i]=i===0?'app':(typeof initial==='function'?initial():initial);if(Array.isArray(states[i]) && states[i].length===0){states[i]=[structuredClone(sample)];studentState=i;}}return [states[i],value=>{states[i]=typeof value==='function'?value(states[i]):value}];},
  useRef(initial){const i=refIndex++;return refs[i] ||= {current:initial};},
  useEffect(){}
 },
 a:(type,props,key)=>({type,props,key}),c:(type,props,key)=>({type,props,key}),
 tv:[sample],rv:[],navigator:{},PersonalProCloud:{}
};
for(const m of code.matchAll(/\b(?:a|c)\(([A-Za-z_$][\w$]*),/g))if(!(m[1] in ctx))ctx[m[1]]=m[1];
vm.createContext(ctx);vm.runInContext(code,ctx);
const render=()=>{stateIndex=0;refIndex=0;return ctx.ua();};
const nodes=(tree)=>{const all=[];const visit=n=>{if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(visit);return;}all.push(n);visit(n.props?.children);};visit(tree);return all;};
const text=n=>typeof n==='string'||typeof n==='number'?String(n):Array.isArray(n)?n.map(text).join(''):text(n?.props?.children||'');
let tree=render();
let button=nodes(tree).find(n=>n.type==='button'&&text(n)==='Marcar treino de hoje');
assert.ok(button,'Today card must offer manual recording');
button.props.onClick();
assert.equal(states[studentState][0].doneOn.length,1);
assert.equal(states[studentState][0].todayStatus,'done');
button.props.onClick();
assert.equal(states[studentState][0].doneOn.length,1,'Repeated recording must not duplicate a day');
tree=render();
assert.ok(nodes(tree).some(n=>n.type==='button'&&text(n)==='Registrado hoje'&&n.props.disabled));
assert.ok(text(tree).includes('Treino registrado pelo personal'));
assert.ok(!text(tree).includes('undefined'));
const viewIndex=states.findIndex(value=>value==='hoje');
states[viewIndex]='alunos';tree=render();
const card=nodes(tree).find(n=>n.type==='button'&&text(n).includes('Aluno de teste'));
assert.ok(card,'Student record remains accessible');card.props.onClick();tree=render();
nodes(tree).find(n=>n.type==='button'&&text(n)==='Abrir atendimentos').props.onClick();tree=render();assert.ok(text(tree).includes('Registro pelo personal'));
const dateInput=nodes(tree).find(n=>n.type==='input'&&n.props['aria-label']==='Data do treino');
assert.ok(dateInput,'Date field is labeled');dateInput.props.onChange({target:{value:'2099-01-01'}});tree=render();
const detailMark=nodes(tree).find(n=>n.type==='button'&&text(n)==='Marcar treino');
assert.ok(detailMark);detailMark.props.onClick();
assert.equal(states[studentState][0].doneOn.length,1,'Future date must not create a record');
tree=render();assert.ok(text(tree).includes('Escolha uma data válida até hoje.'));
assert.ok(!html.includes('seualuno.com')&&!html.includes('function uv('));
assert.ok(html.includes('children:"Enviar texto"'),'WhatsApp workout sharing remains available');
console.log('PASS: Today action; duplicate-safe manual recording; disabled confirmation; student record; date accessibility; future-date rejection; WhatsApp sharing retained; student portal removed.');

if(html.includes('const exerciseLibrary=')) {
 assert.equal(vm.runInContext('exerciseLibrary.length',ctx),130);
 const find=(role,label)=>nodes(tree).find(n=>n.type===role&&n.props?.['aria-label']===label);
 nodes(tree).find(n=>n.props?.['aria-label']==='Voltar à ficha').props.onClick();tree=render();
const openTraining=nodes(tree).find(n=>n.type==='button'&&text(n)==='Abrir treino');assert.ok(openTraining);openTraining.props.onClick();tree=render();
const clickLabel=label=>{const el=nodes(tree).find(n=>n.type==='button'&&text(n).trim()===label);assert.ok(el,label);el.props.onClick();tree=render();};
 const set=(label,value)=>{const el=nodes(tree).find(n=>n.props?.['aria-label']===label);assert.ok(el,label);el.props.onChange({target:{value}});tree=render();};
 clickLabel('Adicionar exercício da biblioteca');
 assert.ok(text(tree).includes('Biblioteca de exercícios'));
 assert.ok(nodes(tree).some(n=>text(n)==='Adicionar à ficha'&&n.props?.disabled));
 set('Buscar exercício na biblioteca','elevacao');
 let results=nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar '));
 assert.ok(results.length>=3,'Search ignores Portuguese accents');
 assert.ok(results.every(n=>{const item=vm.runInContext('exerciseLibrary',ctx).find(x=>'Selecionar '+x.name===n.props['aria-label']);return ctx.normalizeExerciseText(item.name+' '+item.aliases.join(' ')).includes('eleva')}));
 set('Filtrar por grupo muscular','Peito');
 assert.ok(text(tree).includes('Nenhum exercício encontrado'));
 set('Buscar exercício na biblioteca','supino');
 results=nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar '));
 assert.ok(results.length>=4);
 assert.ok(results.every(n=>n.props['aria-label'].toLowerCase().includes('supino')));
 find('button','Selecionar Supino reto com barra').props.onClick();tree=render();
 assert.equal(find('input','Nome do exercício').props.value,'Supino reto com barra');
 set('Séries (vezes)','4');set('Repetições ou duração','8');set('Carga ou intensidade','20 kg');set('Descanso em segundos','90');
 clickLabel('Adicionar à ficha');
 let workout=states[studentState][0].workout;
 assert.equal(workout[0].name,'Supino reto com barra');assert.equal(workout[0].sets,'4x8');assert.equal(workout[0].load,'20 kg');assert.equal(workout[0].rest,90);
 assert.ok(!find('input','Buscar exercício na biblioteca'),'Library closes after adding a prescription');clickLabel('Adicionar exercício da biblioteca');
 set('Filtrar por grupo muscular','Cardio');set('Buscar exercício na biblioteca','bicicleta');
 find('button','Selecionar Bike').props.onClick();tree=render();
 set('Repetições ou duração','15 min');set('Carga ou intensidade','Moderado');set('Descanso em segundos','0');clickLabel('Adicionar à ficha');
 workout=states[studentState][0].workout;
 assert.equal(workout[1].rest,0);assert.equal(workout[1].sets,'15 min');
 clickLabel('Adicionar exercício da biblioteca');clickLabel('Criar exercício personalizado');set('Nome do exercício','Exercício próprio de teste');clickLabel('Adicionar à ficha');
 workout=states[studentState][0].workout;
 assert.equal(workout[2].name,'Exercício próprio de teste');assert.equal(workout[2].sets,'A definir');assert.equal(workout[2].load,'A definir');
 assert.equal(new Set(workout.map(item=>item.id)).size,3);
 clickLabel('Adicionar exercício da biblioteca');clickLabel('Criar exercício personalizado');set('Nome do exercício','Não salvar');clickLabel('Cancelar');assert.equal(states[studentState][0].workout.length,3);

 // Editing preserves all four independent fields and previous load.
 let edit=nodes(tree).find(n=>n.type==='button'&&n.props['aria-label']==='Editar');
 edit.props.onClick();tree=render();
 assert.equal(find('input','Séries (vezes)').props.value,'4');
 assert.equal(find('input','Repetições ou duração').props.value,'8');
 // Audit regression: the name is a separate field, never the first dosage slot.
 set('Nome do exercício','4');clickLabel('Salvar');
 assert.equal(states[studentState][0].workout[0].name,'Supino reto com barra');
 assert.ok(text(tree).includes('Séries, repetições, carga e descanso têm campos próprios.'));
 assert.ok(find('input','Nome do exercício'),'Invalid names keep the editor open');
 set('Nome do exercício','Supino reto com barra');
 set('Séries (vezes)','4');set('Repetições ou duração','8');set('Carga ou intensidade','42.5 kg');set('Descanso em segundos','90');clickLabel('Salvar');
 const prescribed=JSON.parse(JSON.stringify(states[studentState][0].workout[0]));
 assert.equal(prescribed.name,'Supino reto com barra');assert.equal(prescribed.series,'4');assert.equal(prescribed.repetitions,'8');assert.equal(prescribed.load,'42.5 kg');assert.equal(prescribed.rest,90);
 const adapter={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../workout-session-preview.js'),'utf8'),{window:adapter});
 const execution=adapter.PersonalProSessionPreview.adapt([prescribed])[0];
 assert.equal(execution.sets,4);assert.equal(execution.reps,8);assert.equal(execution.restSeconds,90);
 nodes(tree).find(n=>n.type==='button'&&n.props['aria-label']==='Editar').props.onClick();tree=render();
 set('Séries (vezes)','5');set('Repetições ou duração','10–12');set('Carga ou intensidade','25 kg');set('Descanso em segundos','120');clickLabel('Salvar');
 workout=states[studentState][0].workout;
 assert.equal(workout[0].series,'5');assert.equal(workout[0].repetitions,'10–12');assert.equal(workout[0].sets,'5x10–12');assert.equal(workout[0].load,'25 kg');assert.equal(workout[0].lastLoad,'42.5 kg');assert.equal(workout[0].rest,120);
 assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(exerciseDose({sets:"3x12"}))',ctx)),{series:'3',repetitions:'12'});
 assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(exerciseDose({sets:"15 min"}))',ctx)),{series:'',repetitions:'15 min'});
 // Catalogue pagination, metadata filters, details and selection.
 clickLabel('Adicionar exercício da biblioteca');
 assert.ok(!nodes(tree).some(n=>n.props?.['aria-label']==='Escolher catálogo'));
 assert.ok(text(tree).includes('130 exercícios selecionados'));
 assert.ok(!/licença comercial|aprovação técnica|Verificação técnica da biblioteca/.test(text(tree)));
 const catalog=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../exercise-library.json'),'utf8'));
 assert.equal(catalog.length,130);assert.equal(new Set(catalog.map(x=>x.id)).size,130);
 for(const item of catalog){assert.ok(item.name&&item.group&&item.equipment&&item.level);assert.ok(Array.isArray(item.instructions));assert.ok(item.images.every(url=>url.startsWith('https://raw.githubusercontent.com/yuhonas/free-exercise-db/')));}
 const dataState=states.findIndex((value,i)=>value===null && states[i+1]==='' && states[i+2]===0 && states[i+3]===40);
 assert.ok(dataState>=0);states[dataState]=catalog;tree=render();
 assert.equal(nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar ')).length,40);
 const mediaWindow={location:{hostname:'personal-123456789-raidyumeko-9261.vercel.app'}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../exercise-media.js'),'utf8'),{window:mediaWindow});ctx.window=mediaWindow;
 clickLabel('Ver exercícios com vídeo');
 const videoChoices=nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar '));
 assert.equal(videoChoices.length,40);
 assert.ok(text(tree).includes("86 exercícios encontrados"));
 assert.ok(videoChoices.some(n=>n.props['aria-label']==='Selecionar Supino declinado com barra'));
 assert.ok(videoChoices.some(n=>n.props['aria-label']==='Selecionar Crucifixo com halteres'));
 assert.ok(!videoChoices.some(n=>n.props['aria-label']==='Selecionar Ponte de glúteo'));
 assert.ok(text(tree).includes('86 exercícios com vídeo · filtro ativo'));
 clickLabel('Mostrar todos os exercícios');
 assert.ok(text(tree).includes('130 exercícios encontrados'));

 clickLabel('Mostrar mais exercícios');
 assert.equal(nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar ')).length,80);
 set('Buscar exercício na biblioteca','supino');
 const matching=nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar '));
 assert.ok(matching.length>0);assert.ok(matching.every(n=>n.props['aria-label'].toLowerCase().includes('supino')));
 matching[0].props.onClick();tree=render();assert.ok(nodes(tree).some(n=>n.type==='section'&&n.props['aria-label']==='Detalhes do exercício'));assert.ok(nodes(tree).some(n=>n.type==='img'));
 set('Filtrar por equipamento','Peso corporal');
 assert.ok(nodes(tree).filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Selecionar ')).every(n=>text(n).length>0));
 console.log('PASS: 130 selected choices; preview video filter; archived compatibility only; search/filter/pagination; illustrated instructions; add/edit independent series/repetitions/load/rest; previous load; legacy 3x12 and duration compatibility; custom exercise; zero rest; cancel.');
}

async function verifyPDFControls() {
 const findButton=label=>nodes(tree).find(n=>n.type==='button'&&text(n).trim()===label);
 let resolvePDF, receivedStudent, downloaded=0, shared=0;
 const artifact={blob:{type:'application/pdf'},fileName:'treino-aluno.pdf'};
 ctx.window={PersonalProPDF:{
  prepare(student){receivedStudent=student;return new Promise(resolve=>{resolvePDF=resolve})},
  download(file){assert.equal(file,artifact);downloaded++},
  canShare:()=>true,
  share:async file=>{assert.equal(file,artifact);shared++}
 }};
 await findButton('Ver PDF').props.onClick();tree=render();assert.ok(findButton('Gerar ficha'));let pending=findButton('Gerar ficha').props.onClick();tree=render();
 assert.ok(text(tree).includes('Preparando sua ficha'));
 assert.equal(receivedStudent.workout[0].load,'25 kg','Export uses the latest student prescription');
 resolvePDF(artifact);await pending;tree=render();
 assert.ok(findButton('Baixar PDF'));assert.ok(findButton('Compartilhar PDF'));
 findButton('Baixar PDF').props.onClick();assert.equal(downloaded,1);
 await findButton('Compartilhar PDF').props.onClick();assert.equal(shared,1);
 nodes(tree).find(n=>n.props?.['aria-label']==='Fechar PDF').props.onClick();tree=render();
 await findButton('Ver PDF').props.onClick();tree=render();pending=findButton('Gerar ficha').props.onClick();tree=render();
 nodes(tree).find(n=>n.props?.['aria-label']==='Fechar PDF').props.onClick();
 resolvePDF(artifact);await pending;tree=render();
 assert.ok(!nodes(tree).some(n=>n.props?.role==='dialog'&&n.props['aria-label']==='PDF do treino'),'Canceling ignores a stale generation result');
 ctx.window.PersonalProPDF.prepare=async()=>{throw new Error('Sem conexão')};
 await findButton('Ver PDF').props.onClick();tree=render();await findButton('Gerar ficha').props.onClick();tree=render();
 assert.ok(text(tree).includes('Sem conexão'));assert.ok(findButton('Tentar novamente'));
 ctx.window.PersonalProPDF.prepare=async()=>artifact;
 await findButton('Tentar novamente').props.onClick();tree=render();assert.ok(findButton('Baixar PDF'));
 console.log('PASS: PDF dialog loading/ready/error/retry; latest prescription exported; download/share buttons; cancel during generation.');
}
verifyPDFControls().catch(error=>{console.error(error);process.exitCode=1});
