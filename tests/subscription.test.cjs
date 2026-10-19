const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const code = html.slice(html.indexOf('const exerciseLibrary='), html.indexOf('cd.createRoot('));
const until = new Date(Date.now() + 86400000).toISOString();
const account = (paid = true) => ({
  user: {id: 'account-test', app_metadata: paid ? {personal_pro_subscription: {status: 'active', current_period_end: until}} : {}},
  profile: {name: 'Conta real', studio: '', whatsapp: ''}, students: []
});
function harness(serverAccount) {
  const states = [], refs = [], effects = [];
  let stateIndex = 0, refIndex = 0;
  const ctx = {console, Date, Set, Object, Array, Number, String, Math, JSON, tv: [], rv: [], navigator: {},
    R: {
      useState(initial) {const i=stateIndex++; if(!(i in states)) states[i]=i===0?'login':typeof initial==='function'?initial():initial; return [states[i], value=>{states[i]=typeof value==='function'?value(states[i]):value}];},
      useRef(initial) {return refs[refIndex++] ||= {current:initial}},
      useEffect(effect) {effects.push(effect)}
    },
    a: (type,props,key)=>({type,props,key}), c: (type,props,key)=>({type,props,key}),
    PersonalProCloud: {signIn: async()=>serverAccount, save: async()=>{}, signOut: async()=>{}, acceptRecovery:async()=>false,restore:async()=>serverAccount}
  };
  for(const match of code.matchAll(/\b(?:a|c)\(([A-Za-z_$][\w$]*),/g)) if(!(match[1] in ctx)) ctx[match[1]]=match[1];
  vm.createContext(ctx);vm.runInContext(code,ctx);
  const render = () => {stateIndex=refIndex=0;return ctx.ua()};
  const nodes = tree => {const result=[];function visit(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(visit);return;}result.push(n);visit(n.props?.children)}visit(tree);return result};
  const text = n => typeof n==='string'||typeof n==='number'?String(n):Array.isArray(n)?n.map(text).join(''):text(n?.props?.children||'');
  const button = (tree,label) => nodes(tree).find(n=>n.type==='button'&&text(n).trim()===label);
  return {ctx,states,effects,render,nodes,text,button};
}
async function main() {
  const h = harness(account());
  let tree=h.render();assert.ok(!h.button(tree,'Abrir demonstração'));
  await h.nodes(tree).find(n=>n.type==='button'&&h.text(n).trim()==='Entrar'&&n.props.className.includes('h-[54px]')).props.onClick();tree=h.render();
  assert.ok(!h.text(tree).includes('Demonstração. Dados de exemplo.'));
  h.states[h.states.findIndex(value=>value==='hoje')]='financeiro';tree=h.render();
  assert.ok(h.text(tree).includes('Plano Pro'));
  assert.ok(!h.button(tree,'Assinar R$ 29,90'));
  await h.button(tree,'Sair da conta').props.onClick();tree=h.render();
  assert.ok(!h.button(tree,'Abrir demonstração'),'Anonymous demonstration remains disabled after logout');
  const restored = harness(account());restored.render();
  restored.effects.find(effect=>String(effect).includes('acceptRecovery'))();
  await new Promise(resolve=>setImmediate(resolve));
  tree=restored.render();assert.ok(!restored.text(tree).includes('Demonstração. Dados de exemplo.'));
  restored.states[restored.states.findIndex(value=>value==='hoje')]='financeiro';
  assert.ok(restored.text(restored.render()).includes('Plano Pro'),'Reload restores server subscription status');
  const free=harness(account(false));tree=free.render();
  await free.nodes(tree).find(n=>n.type==='button'&&free.text(n).trim()==='Entrar'&&n.props.className.includes('h-[54px]')).props.onClick();
  free.states[free.states.findIndex(value=>value==='hoje')]='financeiro';tree=free.render();
  assert.ok(!free.text(tree).includes('Demonstração. Dados de exemplo.'),'A real free account is not the demo');
  free.button(tree,'Assinar R$ 29,90').props.onClick();tree=free.render();
  assert.ok(free.text(tree).includes('pagamento ainda não está disponível'));
  assert.ok(!free.text(tree).includes('Assinatura ativa'));
  assert.ok(!free.text(tree).includes('Plano Pro'));
  const check = user => {h.ctx.testUser=user;return vm.runInContext('hasActivePersonalProSubscription(testUser)',h.ctx)};
  assert.equal(check(account().user),true);
  assert.equal(check({id:'fake',user_metadata:account().user.app_metadata}),false);
  assert.equal(check({id:'expired',app_metadata:{personal_pro_subscription:{status:'active',current_period_end:'2000-01-01'}}}),false);
  assert.equal(check({id:'bad-date',app_metadata:{personal_pro_subscription:{status:'active',current_period_end:'invalid'}}}),false);
  assert.equal(check({id:'cancelled',app_metadata:{personal_pro_subscription:{status:'cancelled',current_period_end:until}}}),false);
  console.log('PASS: demo to real account; paid login/restore hides demo; logout resets plan; free account is not demo; subscribe cannot fake payment; editable metadata and expired/cancelled entitlements ignored.');
}
main().catch(error=>{console.error(error);process.exitCode=1});
