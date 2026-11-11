/* LGPD: o titular pode excluir a própria conta. A exclusão no servidor depende da
   função pp_delete_my_account (supabase/migrations/20261111160000_account_self_deletion.sql). */
(function (root) {
  'use strict';
  const WORD = 'EXCLUIR';
  function Panel({ React, role = 'trainer' }) {
    const h = React.createElement;
    const [typed, setTyped] = React.useState('');
    const [state, setState] = React.useState({ status: 'idle', message: '' });
    const busy = state.status === 'busy';
    const items = role === 'student'
      ? ['seu histórico de treinos e as respostas do PAR-Q', 'registros e arquivos de nutrição (fotos e PDFs)', 'o vínculo com seu personal e o seu acesso']
      : ['seu perfil, alunos, treinos, avaliações e financeiro', 'os vínculos com alunos, com o histórico de treinos e PAR-Q desses vínculos', 'seu acesso ao aplicativo'];
    async function remove() {
      if (typed.trim().toUpperCase() !== WORD || busy) return;
      setState({ status: 'busy', message: 'Excluindo sua conta…' });
      try {
        await root.PersonalProCloud.deleteAccount({ confirm: true });
        setState({ status: 'done', message: 'Conta excluída. Você será levado para a tela inicial.' });
        root.setTimeout(() => root.location.replace(root.location.pathname), 1500);
      } catch (error) {
        setState({ status: 'error', message: error.message || 'Não foi possível excluir agora. Tente novamente.' });
      }
    }
    return h('details', { className: 'pp-panel pp-account-delete' },
      h('summary', null, 'Excluir minha conta'),
      h('p', null, 'A exclusão é definitiva e apaga:'),
      h('ul', null, items.map((text) => h('li', { key: text }, text))),
      h('p', { className: 'pp-hint' }, 'Recibos de compra de assinatura ficam guardados sem seus dados pessoais, por obrigação fiscal.'),
      role === 'trainer' && h('p', { className: 'pp-hint' }, 'Antes, use "Exportar cópia dos dados" se quiser guardar uma cópia.'),
      h('label', { className: 'pp-field' }, 'Para confirmar, digite ' + WORD,
        h('input', { value: typed, autoComplete: 'off', 'aria-label': 'Digite ' + WORD + ' para confirmar', disabled: busy || state.status === 'done', onChange: (e) => setTyped(e.target.value) })),
      h('button', { type: 'button', className: 'pp-danger pp-full', disabled: busy || state.status === 'done' || typed.trim().toUpperCase() !== WORD, onClick: remove }, busy ? 'Excluindo…' : 'Excluir conta definitivamente'),
      state.message && h('p', { role: state.status === 'error' ? 'alert' : 'status', className: state.status === 'error' ? 'pp-account-delete-error' : 'pp-hint' }, state.message));
  }
  root.PersonalProAccountDeletion = { Panel, WORD };
})(typeof window === 'object' ? window : globalThis);
