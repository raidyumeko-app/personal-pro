const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const stamp='2026-10-20T11:00:00Z';
function nodes(tree){const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}out.push(n);walk(n.props?.children)}walk(tree);return out}
const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):text(n?.props?.children||[]);
const h=(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:{...props,children}});
test('gray and green receipt have explicit labels for both accounts and no message field',()=>{
 const root={};vm.runInNewContext(fs.readFileSync('feedback-status.js','utf8'),{window:root});
 const props={React:{createElement:h}};
 const sent=root.PersonalProFeedback.Status(props),seen=root.PersonalProFeedback.Status({...props,seenAt:stamp});
 assert.match(text(sent),/Enviado · Ainda não visto/);assert.ok(!sent.props.className.includes('is-seen'));assert.match(text(seen),/Seu personal viu/);assert.match(seen.props.className,/is-seen/);
 const trainer=root.PersonalProFeedback.Status({...props,trainer:true});assert.equal(trainer.type,'button');assert.equal(trainer.props['aria-label'],'Marcar feedback como visto');assert.equal(root.PersonalProFeedback.Status({...props,trainer:true,seenAt:stamp}).type,'span');assert.ok(!nodes(trainer).some(n=>n.type==='input'));
});
function dashboard(){
 let states=[],refs=[],i=0,ri=0,effects=[],tree,fail=false,hold=null,calls=0;
 const session={id:'qa-session',link_id:'qa-link',day:'A',completed_at:stamp,logs:[{}],effort:'Puxado',student_note:'QA',feedback_seen_at:null};
 const root={PersonalProSchedule:{today:()=> '2026-10-20',appointments:()=>[]},PersonalProAPI:{rows:async t=>t==='pp_links'?[{id:'qa-link',legacy_student_id:'qa'}]:[session],markFeedbackSeen:async()=>{calls++;if(hold)await hold;if(fail)throw Error('Sem conexão');return stamp}}};
 for(const f of ['feedback-status.js','trainer-dashboard.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),{window:root});
 const R={createElement:h,useState(v){const n=i++;if(!(n in states))states[n]=v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useRef(v){return refs[ri++]||=({current:v})},useEffect(fn){effects.push(fn)}};
 const render=()=>{i=ri=0;effects=[];tree=root.PersonalProDashboard.Dashboard({React:R,students:[{id:'qa',name:'QA'}]});return tree};render();effects[0]();
 return{render,ready:()=>new Promise(r=>setImmediate(r)),mark:()=>nodes(tree).find(n=>n.props['aria-label']==='Marcar feedback como visto'),calls:()=>calls,hold:p=>hold=p,fail:v=>fail=v};
}
test('trainer changes to green only after acknowledgement; simultaneous clicks issue one call',async()=>{
 const d=dashboard();await d.ready();d.render();let release;d.hold(new Promise(r=>release=r));const first=d.mark().props.onClick();const second=d.mark().props.onClick();assert.equal(d.calls(),1);assert.ok(!JSON.stringify(d.render()).includes('is-seen'));release();await Promise.all([first,second]);assert.match(JSON.stringify(d.render()),/is-seen/);assert.equal(d.mark(),undefined);
});
test('failed acknowledgement remains gray with an error and can be retried',async()=>{
 const d=dashboard();await d.ready();d.render();d.fail(true);await d.mark().props.onClick();assert.match(text(d.render()),/Sem conexão/);assert.ok(d.mark());assert.ok(!JSON.stringify(d.render()).includes('is-seen'));d.fail(false);await d.mark().props.onClick();assert.match(JSON.stringify(d.render()),/is-seen/);
});
test('session adapter restores the persisted receipt, and receipt queries reject malformed ids',async()=>{
 const requests=[],root={PersonalProCloud:{userId:()=> 'qa',request:async(path)=>{requests.push(path);return []}},PersonalProSessionPreview:{adapt:v=>v}};vm.runInNewContext(fs.readFileSync('portal-api.js','utf8'),{window:root});
 assert.equal(root.PersonalProAPI.fromServer({prescription:[],feedback_seen_at:stamp}).feedbackSeenAt,stamp);assert.equal(root.PersonalProAPI.fromServer({prescription:[]}).feedbackSeenAt,null);
 await root.PersonalProAPI.feedbackReceipts(['injected)']);assert.equal(requests.length,0);await root.PersonalProAPI.feedbackReceipts(['d5000000-0000-4000-8000-000000000010']);assert.match(requests[0],/select=id,feedback_seen_at/);
});
test('open student screen receives the green receipt on refresh tick without losing workout history',async()=>{
 let states=[],i=0,effects=[],tick,seen=false,fail=false;
 const id='d5000000-0000-4000-8000-000000000010';
 const root={addEventListener(){},removeEventListener(){},PersonalProMedia:{resolve:x=>x},PersonalProCloud:{signOut:async()=>{}},PersonalProUI:{Icon(){}},PersonalProAPI:{studentAccess:async()=>({active:true,expiresAt:'2026-11-20T00:00:00Z',serverNow:stamp}),studentData:async()=>({trainerName:'QA Personal',student:{name:'QA',workout:[]}}),sessions:async()=>[{id,workoutId:'A',completedAt:stamp,logs:[{exerciseId:'qa',weightKg:10}],exercises:[],feedbackSeenAt:null}],feedbackReceipts:async()=>{if(fail)throw Error('Offline');return[{id,feedback_seen_at:seen?stamp:null}]}}};
 vm.runInNewContext(fs.readFileSync('feedback-status.js','utf8'),{window:root});
 const R={createElement:(type,props,...children)=>type===root.PersonalProFeedback.Status?type(props):({type,props:{...props,children}}),useState(v){const n=i++;if(!(n in states))states[n]=typeof v==='function'?v():v;return[states[n],v=>states[n]=typeof v==='function'?v(states[n]):v]},useEffect(fn){effects.push(fn)}};
 vm.runInNewContext(fs.readFileSync('portal-app.js','utf8'),{window:root,Date,URLSearchParams,location:{search:''},fetch:async()=>({json:async()=>[]}),setTimeout(){},clearTimeout(){},setInterval:fn=>{tick=fn;return 1},clearInterval(){}});
 root.PersonalProPortal.Shell({React:R,Legacy:()=>{}});states=[];
 const render=()=>{i=0;effects=[];return root.PersonalProPortal.Student({member:{name:'QA',user_id:'qa'}})};
 render();effects[0]();await new Promise(r=>setImmediate(r));assert.match(text(render()),/Enviado · Ainda não visto/);const cleanup=effects[2]();
 fail=true;await tick();assert.ok(!JSON.stringify(render()).includes('is-seen'));fail=false;seen=true;await tick();const tree=render();assert.match(text(tree),/Seu personal viu/);assert.match(JSON.stringify(tree),/is-seen/);assert.ok(!text(tree).includes('Parabéns'));cleanup();
});
