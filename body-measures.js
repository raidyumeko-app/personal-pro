/* Personal Pro — visualização reutilizável de medidas reais.
   Sem dados de exemplo, sem estimativas corporais e sem gravação automática. */
(function (root) {
  'use strict';
  const regions = [
    ['braco','Braço'], ['antebraco','Antebraço'], ['peito','Peito'],
    ['cintura','Cintura'], ['quadril','Quadril'], ['coxa','Coxa'],
    ['panturrilha','Panturrilha']
  ];
  function safeNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  function normalize(entries) {
    return (Array.isArray(entries) ? entries : []).filter(x =>
      x && regions.some(([id]) => id === x.region) && safeNumber(x.value) !== null &&
      (x.date == null || typeof x.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.date))
    ).map(x => ({region:x.region, value:safeNumber(x.value), date:x.date||null,current:!!x.current}))
      .sort((a,b) => Number(b.current)-Number(a.current)||String(b.date||'').localeCompare(String(a.date||'')));
  }
  function render(container, entries) {
    if (!container) throw new Error('Container de medidas obrigatório');
    const history = normalize(entries);
    container.replaceChildren();
    container.classList.add('pp-body-measures');
    const title = document.createElement('h2');
    title.textContent = 'Medidas corporais';
    container.append(title);
    if (!history.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Nenhuma avaliação corporal registrada ainda.';
      container.append(empty);
      return;
    }
    const layout = document.createElement('div');
    layout.className = 'pp-body-measures-layout';
    const silhouette = document.createElementNS('http://www.w3.org/2000/svg','svg');
    silhouette.setAttribute('viewBox','0 0 240 520');
    silhouette.setAttribute('role','img');
    silhouette.setAttribute('aria-label','Silhueta ilustrativa do corpo humano, sem estimativa de medidas');
    const shape = document.createElementNS('http://www.w3.org/2000/svg','path');
    shape.setAttribute('d','M120 18c-29 0-40 20-40 45 0 22 12 36 24 43l-4 18-35 11c-22 7-28 23-33 49L14 295c-4 24 24 31 31 7l32-106 5 114-13 172c-2 30 34 33 40 4l16-148 16 148c6 29 42 26 40-4l-13-172 5-114 32 106c7 24 35 17 31-7l-18-111c-5-26-11-42-33-49l-35-11-4-18c12-7 24-21 24-43 0-25-11-45-40-45z');
    shape.setAttribute('fill','#222a24');
    shape.setAttribute('stroke','#b6f45d');
    shape.setAttribute('stroke-width','3');
    silhouette.append(shape);
    layout.append(silhouette);
    const list = document.createElement('div');
    list.className = 'pp-body-measures-list';
    regions.forEach(([id,label]) => {
      const values = history.filter(x => x.region === id);
      if (!values.length) return;
      const item = document.createElement('details');
      const summary = document.createElement('summary');
      const current = values[0], previous = values[1];
      const delta = previous ? current.value - previous.value : null;
      summary.textContent = label + ' · ' + current.value.toLocaleString('pt-BR') + ' cm · ' + (current.date||'Data não registrada') +
        (delta === null ? '' : ' · ' + (delta > 0 ? '+' : '') + delta.toLocaleString('pt-BR') + ' cm');
      item.append(summary);
      values.forEach(record => {
        const p = document.createElement('p');
        p.textContent = (record.date||'Data não registrada') + ' — ' + record.value.toLocaleString('pt-BR') + ' cm';
        item.append(p);
      });
      list.append(item);
    });
    layout.append(list);
    container.append(layout);
  }
  root.PersonalProBodyMeasures = Object.freeze({render, normalize});
})(window);
