/* Dados de contato do controlador (LGPD). Preencha os três campos antes de publicar. */
(function (root) {
  'use strict';
  const placeholders = Object.freeze({
    controllerName: '[NOME/CNPJ]',
    contactEmail: '[E-MAIL DE CONTATO]',
    forum: '[CIDADE/ESTADO DO CONTROLADOR]'
  });
  function apply(doc) {
    const d = doc || root.document;
    if (!d) return;
    d.querySelectorAll('[data-legal]').forEach((el) => {
      const key = el.getAttribute('data-legal');
      if (key && Object.prototype.hasOwnProperty.call(placeholders, key)) {
        el.textContent = placeholders[key];
      }
    });
  }
  if (root.document) {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', () => apply());
    } else {
      apply();
    }
  }
  root.PersonalProLegal = Object.freeze({
    placeholders,
    privacyPath: '/privacidade.html',
    termsPath: '/termos.html',
    apply
  });
})(typeof window === 'object' ? window : globalThis);
