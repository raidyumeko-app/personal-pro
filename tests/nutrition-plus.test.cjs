const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
// Regra de 11/11/2026: depois de 30 dias só a nutrição extra fica paga (R$ 4,90/mês); o plano salvo continua visível.
function panel(access,entries){
 let states=[],refs=[],i=0,ri=0,effects=[],tree;const removed=[];
 const root={PersonalProAPI:{studentAccess:async()=>access,nutrition:async()=>[[],entries.filter(e=>!removed.includes(e.id))],signed:async()=>'blob:x',removeEntry:async(id)=>{removed.push(id)}},open(){}};
 const R={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children}),useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useRef(v){return refs[ri++]||=({current:v})},useEffect(fn){effects.push(fn)}};
 vm.runInNewContext(fs.readFileSync('nutrition.js','utf8'),{window:root,Date,crypto});
 const render=()=>{i=ri=0;effects=[];tree=root.PersonalProNutrition.Panel({React:R,member:{}});return tree};
 const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.children||[]):'';
 const nodes=()=>{const out=[];(function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.children)})(tree);return out};
 const click=label=>nodes().find(n=>n.type==='button'&&text(n)===label).props.onClick();
 return {render,start:async()=>{render();effects[0]();await new Promise(r=>setImmediate(r));render()},text:()=>text(tree),click,removed:()=>removed.slice()};
}
const plan={id:'p',kind:'plan',confirmed:true,file_path:'u/plano.pdf',occurred_at:'2026-10-01T10:00:00Z',plan_data:{meals:[{time:'07:00',title:'Café da manhã',text:'2 ovos'}]}};
test('expired Plus shows the R$ 4,90 notice only inside nutrition and keeps the saved plan visible',async()=>{
 const p=panel({active:false,status:'expired',monthlyPriceBRL:4.9},[plan]);await p.start();const t=p.text();
 assert.match(t,/R\$ 4,90\/mês/);assert.ok(!/R\$ 9,90/.test(t));assert.match(t,/Seu treino continua grátis/);
 assert.match(t,/Café da manhã/);assert.match(t,/Abrir PDF original/);assert.ok(!t.includes('Consumido agora'));
 p.click('Importar');p.render();assert.ok(!p.text().includes('Envie o PDF do seu nutricionista'),'import is a paid extra');
 p.click('Diário');p.render();assert.ok(!p.text().includes('Salvar refeição'),'meal diary with photos is a paid extra');
});
test('trial unlocks nutrition extras and shows when the free period ends',async()=>{
 const p=panel({active:true,status:'trial',trialUntil:'2026-12-01T12:00:00Z'},[plan]);await p.start();const t=p.text();
 assert.ok(!t.includes('Assinar Personal Pro+'));assert.match(t,/Nutrição extra grátis até/);assert.match(t,/Consumido agora/);
 p.click('Importar');p.render();assert.match(p.text(),/Envie o PDF do seu nutricionista/);
});

test('owner can delete a saved nutrition entry without Plus',async()=>{
 const meal={id:'m1',kind:'meal',text:'Ovos e pão',occurred_at:'2026-10-01T10:00:00Z'};
 const p=panel({active:false,status:'expired',monthlyPriceBRL:4.9},[plan,meal]);await p.start();
 p.click('Diário');p.render();
 assert.match(p.text(),/Ovos e pão/);assert.match(p.text(),/Excluir registro/);
 assert.ok(!p.text().includes('Salvar refeição'),'creating stays a paid extra');
 p.click('Excluir registro');await new Promise(r=>setImmediate(r));p.render();
 assert.deepEqual(p.removed(),['m1']);assert.ok(!p.text().includes('Ovos e pão'));
});
