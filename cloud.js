/* Public configuration only. Authorization is enforced by PostgreSQL RLS. */
(() => {
  const url = 'https://lnlwkjsfcpeofhajqesh.supabase.co';
  const key = 'sb_publishable_6pdzzn9QCSJTcZSF60NuBA_gC02pygI';
  let session = null;
  let refreshPromise;
  let writeQueue = Promise.resolve();
  let recoveryPromise;
  let latestDraftId=null;
  let syncState = {status:'idle', message:'Pronto'}, sequence=0;
  const listeners = new Set();
  const announce = (status,message) => {syncState={status,message};for(const listener of listeners)listener(syncState)};
  const draftKey = owner => 'personal-pro-draft:'+owner;
  const readDraft = owner => {try{const draft=JSON.parse(localStorage.getItem(draftKey(owner))||'null');return draft&&draft.owner===owner&&typeof draft.id==='string'&&draft.profile&&typeof draft.profile==='object'&&Array.isArray(draft.students)?draft:null}catch{return null}};
  const storeDraft = draft => {try{localStorage.setItem(draftKey(draft.owner),JSON.stringify(draft));return true}catch{return false}};
  const removeDraft = (owner,id) => {try{const draft=readDraft(owner);if(!id||draft?.id===id)localStorage.removeItem(draftKey(owner))}catch{}};

  try { session = JSON.parse(sessionStorage.getItem('personal-pro-session') || 'null'); } catch {}
  const remember = data => {
    session = data?.access_token ? {...data, expires_at: data.expires_at || Date.now()/1000 + data.expires_in} : null;
    if (session) sessionStorage.setItem('personal-pro-session', JSON.stringify(session));
    else sessionStorage.removeItem('personal-pro-session');
    return session;
  };
  async function request(path, options = {}, authenticated = false) {
    if (authenticated) {
      if (!session) throw new Error('Entre na sua conta para salvar.');
      if (session.expires_at < Date.now()/1000 + 60) {
        const pendingReset = session.pending_password_reset;
        refreshPromise ||= request('/auth/v1/token?grant_type=refresh_token', {method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})}).then(data=>remember({...data,pending_password_reset:pendingReset})).finally(()=>{refreshPromise=null});
        await refreshPromise;
      }
    }
    let response;try { response = await fetch(url + path, {signal:AbortSignal.timeout(20000),...options, headers:{apikey:key,'Content-Type':'application/json',...(authenticated ? {Authorization:'Bearer '+session.access_token} : {}),...options.headers}}); } catch(error) { throw new Error(error.name==='TimeoutError'||error.name==='AbortError'?'A conexão demorou. Confira sua internet e tente novamente.':'Não foi possível conectar. Confira sua internet e tente novamente.'); }
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { throw new Error('Resposta inválida do servidor.'); }
    if (!response.ok) {const errors={invalid_credentials:'E-mail ou senha incorretos.',email_not_confirmed:'Confirme seu e-mail antes de entrar.',over_email_send_rate_limit:'Limite de e-mails atingido. Aguarde e tente novamente.'};throw new Error(errors[data?.code||data?.error_code] || data?.msg || data?.message || data?.error_description || 'Não foi possível conectar à sua conta.');}
    return data;
  }
  async function load() {
    const user = await request('/auth/v1/user', {}, true);
    const rows = await request('/rest/v1/personal_pro_accounts?user_id=eq.'+encodeURIComponent(user.id)+'&select=profile,students', {}, true);
    const pending=readDraft(user.id);announce(pending?'recovery':'saved',pending?'Há uma cópia local pendente para revisar.':'Salvo na sua conta');
    return {user, profile:rows[0]?.profile || {name:'',whatsapp:'',studio:''},students:rows[0]?.students || [],pendingDraft:readDraft(user.id)};
  }
  window.PersonalProCloud = {
    getSyncState: () => syncState,
    userId: () => session?.user?.id,
    request: (path,options={}) => request(path,options,true),
    subscribeSync(listener) {listeners.add(listener);listener(syncState);return()=>listeners.delete(listener)},
    getDraft() {return session?.user?.id?readDraft(session.user.id):null},
    clearDraft() {if(session?.user?.id)removeDraft(session.user.id);announce('saved','Dados da conta mantidos')},
    retry() {const draft=this.getDraft();return draft?this.save(draft.profile,draft.students):Promise.resolve()},
    async signIn(email,password) {
      remember(await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})}));
      return load();
    },
    async signUp(email,password) {
      const data = await request('/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',body:JSON.stringify({email,password})});
      if (!data.access_token) return null;
      remember(data);
      return load();
    },
    recover(email) { return request('/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',body:JSON.stringify({email})}); },
    async restore() { return session ? load() : null; },
    save(profile, students) {
      if (!session?.user?.id) return Promise.reject(new Error('Sessão ausente. Entre novamente.'));
      const owner = session.user.id;
      const draft={owner,id:Date.now()+'-'+(++sequence),at:new Date().toISOString(),profile:JSON.parse(JSON.stringify(profile)),students:JSON.parse(JSON.stringify(students))};
      latestDraftId=draft.id;
      const persisted=storeDraft(draft);
      announce('saving',persisted?'Salvando…':'Salvando… cópia local indisponível neste navegador.');
      const body = JSON.stringify({user_id:owner,profile,students,updated_at:new Date().toISOString()});
      const operation = writeQueue.catch(()=>{}).then(()=>{
        if (session?.user?.id !== owner) throw new Error('A conta mudou antes de salvar.');
        return request('/rest/v1/personal_pro_accounts?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body},true);
      });
      const tracked=operation.then(result=>{removeDraft(owner,draft.id);if(latestDraftId===draft.id&&!readDraft(owner))announce('saved','Salvo na sua conta');return result}).catch(error=>{if(session?.user?.id===owner)announce('pending',persisted?'Não sincronizado. Cópia local preservada; tente novamente.':'Não foi possível salvar. Mantenha esta aba aberta e exporte uma cópia.');throw error});
      writeQueue = tracked;
      return tracked;
    },
    async signOut() {
      await writeQueue.catch(()=>{});
      try { if (session) await request('/auth/v1/logout',{method:'POST'},true); }
      finally {remember(null);announce('idle','Sessão encerrada');window.dispatchEvent?.(new Event('personal-pro-signout'));}
    },
    async updatePassword(password) {
      const user = await request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password})},true);
      remember({...session,user,pending_password_reset:false});
      return user;
    },
    acceptRecovery() {
      return recoveryPromise ||= (async () => {
      const hash = new URLSearchParams(location.hash.slice(1));
      if (hash.has('error') || hash.has('error_code')) {
        history.replaceState(null,'',location.pathname+location.search);
        throw new Error('Este link de e-mail é inválido ou expirou. Solicite um novo link de recuperação ou entre para confirmar seu cadastro.');
      }
      if (!hash.get('access_token')) {
        if (!session?.pending_password_reset) return false;
        await request('/auth/v1/user',{},true);
        return true;
      }
      const isRecovery = hash.get('type') === 'recovery';
      const previous = session;
      remember({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token'),expires_in:Number(hash.get('expires_in')) || 3600,pending_password_reset:isRecovery});
      history.replaceState(null,'',location.pathname+location.search);
      let user;
      try { user = await request('/auth/v1/user',{},true); }
      catch (error) { remember(previous); throw error; }
      session.user=user; remember(session);
      return isRecovery;
      })();
    }
  };
  // Only drafts created in this running session are retried automatically.
  // A draft found at login is offered for review by the app before recovery.
  let retrying=false;
  window.addEventListener?.('online',async()=>{if(retrying||syncState.status!=='pending'||!session?.user?.id)return;retrying=true;try{await window.PersonalProCloud.retry()}catch{}finally{retrying=false}});
})();
