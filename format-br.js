/* Formatação brasileira usada nas telas, no PDF e no CSV: vírgula decimal, datas dd/mm/aaaa e plural correto. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.PersonalProFormat = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function decimal(value, digits = 2) {
    if (value === null || value === undefined || value === '') return '';
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n.toLocaleString('pt-BR', { maximumFractionDigits: digits }) : String(value);
  }
  /* Carga digitada livremente ("7.5 kg", "7,5kg", "peso corporal"): troca só o ponto decimal entre dígitos. */
  function load(value) {
    return String(value ?? '').replace(/(\d)\.(\d)/g, '$1,$2');
  }
  function kg(value) { const text = decimal(value); return text ? text + ' kg' : ''; }
  /* Aceita 2026-11-10, 2026-11-10T13:00:00Z ou Date; devolve 10/11/2026. Texto inválido volta como veio. */
  function date(value) {
    if (value === null || value === undefined || value === '') return '';
    const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (plain) return plain[3] + '/' + plain[2] + '/' + plain[1];
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  }
  /* "2026-11" -> "11/2026" */
  function month(value) {
    const m = /^(\d{4})-(\d{2})/.exec(String(value || ''));
    return m ? m[2] + '/' + m[1] : String(value || '');
  }
  function count(n, singular, plural) {
    const value = Number(n) || 0;
    return value + ' ' + (Math.abs(value) === 1 ? singular : plural);
  }
  return { decimal, load, kg, date, month, count };
});
