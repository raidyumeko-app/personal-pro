const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
function harness(){
 let states=[],refs=[],i=0,ri=0,effects=[],tree,entries=[],pending=null,fail=false,lostResponse=false,writes=0;
 const root={PersonalProAPI:{studentAccess:async()=>({active:true}),nutrition:async()=>[[],entries],write:async(table,item)=>{writes++;if(pending)await pending;if(fail)throw Error('Sem conexão');entries=[{...item,occurred_at:new Date().toISOString()},...entries.filter(e=>e.id!==item.id)];if(lostResponse)throw Error('Resposta interrompida')}}};
 const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useRef(v){return refs[ri++]||=( {current:v} )},useEffect(fn){effects.push(fn)}};
 vm.runInNewContext(fs.readFileSync('nutrition.js','utf8'),{window:root,Date,crypto});
 const render=()=>{i=ri=0;effects=[];tree=root.PersonalProNutrition.Panel({React:R,member:{}});return tree};
 const nodes=()=>{const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.children)}walk(tree);return out};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):text(n?.children||[]);
 const click=label=>nodes().find(n=>n.type==='button'&&text(n)===label).props.onClick();
 const flush=()=>new Promise(r=>setImmediate(r));
 render();effects[0]();
 return{async ready(){await flush();render();click('Diário');render()},render,nodes,text,click,flush,setText(v){nodes().find(n=>n.type==='textarea').props.onChange({target:{value:v}});render()},submit(){return nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}})},hold(p){pending=p},fail(v){fail=v},loseResponse(v){lostResponse=v},writes:()=>writes,entries:()=>entries};
}
test('nutrition ignores a second synchronous meal submission while the first is pending',async()=>{
 const h=harness();await h.ready();h.setText('QA refeição');let release;h.hold(new Promise(r=>release=r));h.submit();h.submit();assert.equal(h.writes(),1);release();await h.flush();h.render();assert.equal(h.entries().length,1);
});
test('nutrition retains meal input after a failed save and retries without false success',async()=>{
 const h=harness();await h.ready();h.setText('QA refeição offline');h.fail(true);h.submit();await h.flush();h.render();assert.equal(h.entries().length,0);assert.equal(h.nodes().find(n=>n.type==='textarea').props.value,'QA refeição offline');assert.match(h.text(h.render()),/Sem conexão/);assert.ok(!h.text(h.render()).includes('Refeição salva.'));h.fail(false);h.submit();await h.flush();h.render();assert.equal(h.entries().length,1);assert.equal(h.nodes().find(n=>n.type==='textarea').props.value,'');assert.match(h.text(h.render()),/Refeição salva/);
});
test('retry after a committed meal loses its response reuses the same id',async()=>{
 const h=harness();await h.ready();h.setText('QA resposta perdida');h.loseResponse(true);h.submit();await h.flush();h.render();assert.equal(h.entries().length,1);const id=h.entries()[0].id;h.loseResponse(false);h.submit();await h.flush();h.render();assert.equal(h.entries().length,1);assert.equal(h.entries()[0].id,id);assert.match(h.text(h.render()),/Refeição salva/);
});
