/* Public configuration only. Authorization is enforced by PostgreSQL RLS. */
(() => {
  const url = 'https://lnlwkjsfcpeofhajqesh.supabase.co';
  const key = 'sb_publishable_6pdzzn9QCSJTcZSF60NuBA_gC02pygI';
  let session = null;
  let refreshPromise;
  let writeQueue = Promise.resolve();
  let recoveryPromise;
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
        refreshPromise ||= request('/auth/v1/token?grant_type=refresh_token', {method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})}).then(remember).finally(()=>{refreshPromise=null});
        await refreshPromise;
      }
    }
    const response = await fetch(url + path, {signal:AbortSignal.timeout(15000),...options, headers:{apikey:key,'Content-Type':'application/json',...(authenticated ? {Authorization:'Bearer '+session.access_token} : {}),...options.headers}});
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { throw new Error('Resposta inválida do servidor.'); }
    if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Não foi possível conectar à sua conta.');
    return data;
  }
  async function load() {
    const user = await request('/auth/v1/user', {}, true);
    const rows = await request('/rest/v1/personal_pro_accounts?user_id=eq.'+encodeURIComponent(user.id)+'&select=profile,students', {}, true);
    return {user, profile:rows[0]?.profile || {name:'',whatsapp:'',studio:''},students:rows[0]?.students || []};
  }
  window.PersonalProCloud = {
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
      const body = JSON.stringify({user_id:owner,profile,students,updated_at:new Date().toISOString()});
      const operation = writeQueue.catch(()=>{}).then(()=>{
        if (session?.user?.id !== owner) throw new Error('A conta mudou antes de salvar.');
        return request('/rest/v1/personal_pro_accounts?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body},true);
      });
      writeQueue = operation;
      return operation;
    },
    async signOut() {
      await writeQueue.catch(()=>{});
      if (session) await request('/auth/v1/logout',{method:'POST'},true);
      remember(null);
    },
    async updatePassword(password) { return request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password})},true); },
    acceptRecovery() {
      return recoveryPromise ||= (async () => {
      const hash = new URLSearchParams(location.hash.slice(1));
      if (!hash.get('access_token')) return false;
      const isRecovery = hash.get('type') === 'recovery';
      remember({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token'),expires_in:Number(hash.get('expires_in')) || 3600});
      history.replaceState(null,'',location.pathname+location.search);
      const user = await request('/auth/v1/user',{},true);
      session.user=user; remember(session);
      return isRecovery;
      })();
    }
  };
})();
