const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root={};vm.runInNewContext(fs.readFileSync('parq.js','utf8'),{window:root});const api=root.PersonalProParQ;
test('unanswered questions are not interpreted as no, and yes is a review flag only',()=>{
 for(const a of [[],Array(7).fill(null),Array(6).fill(false),Array(7).fill('false')])assert.equal(api.validAnswers(a),false);
 assert.equal(api.validAnswers(Array(7).fill(false)),true);assert.equal(api.status(Array(7).fill(false)),'Nenhuma resposta “sim”');assert.equal(api.status([true,...Array(6).fill(false)]),'Há respostas para revisar');
});
function harness(props){let state=[],refs=[],i=0,j=0,tree;const R={Fragment:'fragment',createElement:(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:{...props,children}}),useState(v){const n=i++;if(!(n in state))state[n]=typeof v==='function'?v():v;return[state[n],v=>state[n]=typeof v==='function'?v(state[n]):v]},useRef(v){const n=j++;return refs[n]||=( {current:v})},useEffect(){}};return{render(){i=0;j=0;tree=api.Panel({React:R,...props});return tree},nodes(){const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n))return n.forEach(walk);out.push(n);walk(n.props?.children)}walk(tree);return out}}}
const txt=n=>typeof n==='string'?n:Array.isArray(n)?n.map(txt).join(''):txt(n?.props?.children||[]);
test('preview requires every answer and consent, and never sends health data',async()=>{
 const h=harness({demo:true});h.render();let nodes=h.nodes();assert.equal(nodes.filter(n=>n.type==='fieldset').length,7);let button=nodes.find(n=>n.type==='button'&&txt(n)==='Enviar PAR-Q');assert.equal(button.props.disabled,true);
 for(let i=0;i<7;i++){nodes.filter(n=>n.type==='input'&&n.props.type==='radio')[i*2+1].props.onChange();h.render();nodes=h.nodes()}
 assert.equal(nodes.find(n=>n.type==='button'&&txt(n)==='Enviar PAR-Q').props.disabled,true);
 nodes.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});h.render();button=h.nodes().find(n=>n.type==='button'&&txt(n)==='Enviar PAR-Q');assert.equal(button.props.disabled,false);await button.props.onClick();h.render();assert.match(txt(h.render()),/nenhuma resposta foi salva/);
});
