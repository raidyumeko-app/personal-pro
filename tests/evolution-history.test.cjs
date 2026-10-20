const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('two dated body assessments preserve previous values and feed silhouette comparisons',()=>{
 let student={id:'qa',measures:{},measureHistory:[],lastAssessmentDate:'2026-10-18'},states=[],i=0,tree;
 const root={};vm.runInNewContext(fs.readFileSync('schedule.js','utf8'),{window:root,Date});vm.runInNewContext(fs.readFileSync('student-sections.js','utf8'),{window:root,Date});
 const R={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]}};
 const render=()=>{i=0;tree=root.PersonalProStudentSections.Assessment({React:R,student,onChange:(id,fn)=>student=fn(student),notify(){}})};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.children)}walk(tree);return out};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):text(n?.children||[]);
 const set=(label,value)=>nodes().find(n=>n.props['aria-label']===label).props.onChange({target:{value}});
 const save=()=>nodes().find(n=>n.type==='button'&&text(n)==='Salvar avaliação').props.onClick();
 render();set('Cintura (cm)','82');set('Braço (cm)','34');render();save();assert.equal(student.measureDates.waist,'2026-10-18');
 render();set('Data da avaliação','2026-10-19');set('Cintura (cm)','81');set('Braço (cm)','34.5');render();save();
 assert.equal(student.measures.waist,81);assert.equal(student.measureDates.waist,'2026-10-19');assert.equal(student.measureHistory.length,2);assert.deepEqual(JSON.parse(JSON.stringify(student.measureHistory[0])),{date:'2026-10-18',region:'waist',value:82});
 let entries;const mount={};const effects=[];root.PersonalProBodyMeasures={render:(node,data)=>{assert.equal(node,mount);entries=data}};
 root.PersonalProStudentSections.BodyMeasures({React:{createElement(){},useRef:()=>({current:mount}),useEffect:fn=>effects.push(fn)},student});effects[0]();assert.equal(entries.length,4);assert.ok(entries.some(e=>e.region==='cintura'&&e.value===81&&e.current));assert.ok(entries.some(e=>e.region==='cintura'&&e.value===82&&e.date==='2026-10-18'));
 class Element{constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.classList={add(){}}}append(...items){this.children.push(...items)}replaceChildren(){this.children=[]}setAttribute(k,v){this.attrs[k]=v}addEventListener(){}}
 const document={createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag)};vm.runInNewContext(fs.readFileSync('body-measures.js','utf8'),{window:root,document});const container=new Element('div');root.PersonalProBodyMeasures.render(container,entries);
 const flatten=n=>(n.textContent||'')+n.children.map(flatten).join(' ');assert.match(flatten(container),/Cintura · 81 cm · 2026-10-19 · -1 cm/);assert.match(flatten(container),/Braço · 34,5 cm/);assert.ok(container.children[1].children.some(n=>n.tag==='svg'));
});
