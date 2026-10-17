const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const jspdf = require('../vendor/jspdf-4.2.1.umd.min.js');
const source = fs.readFileSync(path.join(__dirname, '../workout-pdf.js'), 'utf8');
const clicks = [], timers = [], shared = [];
const env = {
  jspdf, Blob, File, navigator: {},
  URL: {createObjectURL: () => 'blob:test', revokeObjectURL: url => clicks.push(url)},
  setTimeout: callback => timers.push(callback),
  document: {
    body: {appendChild() {}},
    createElement: () => ({style: {}, click() {clicks.push(this.download)}, remove() {}})
  }
};
vm.runInNewContext(source, {window: env, console});
const api = env.PersonalProPDF;
const student = {
  name: 'João Gonçalves', notes: 'SEGREDO: nota privada', planValue: 'SEGREDO: cobrança',
  measures: {waist: 'SEGREDO: medidas'},
  workout: [
    {name: 'Agachamento com barra', series: '4', repetitions: '8–12', load: '30 kg', rest: 90},
    {name: 'Elevação lateral', sets: '3x12', load: '5 kg', rest: 60},
    {name: 'Bicicleta ergométrica', sets: '15 min', load: 'Moderado', rest: 0},
    {name: 'Flexão de braços', series: '3', repetitions: 'Até a falha técnica', load: 'Peso corporal', rest: 75}
  ]
};
const coach = {name: 'André Oliveira', studio: 'Estúdio Movimento'};
const doc = api.makeDocument(student, coach, new Date(2026, 9, 17, 12));
assert.equal(doc.getNumberOfPages(), 1);
const operators = doc.internal.pages.flat().join('\n');
for (const text of ['João Gonçalves', 'André Oliveira', 'Agachamento com barra', '8-12', '30 kg', '90 s', '15 min', '0 s'])
  assert.ok(operators.includes(text), text);
assert.ok(!operators.includes('SEGREDO'));

assert.throws(() => api.makeDocument({name: 'Sem treino', workout: []}), /Adicione exercícios/);
const long = api.makeDocument({...student, workout: Array.from({length: 85}, (_, i) => ({...student.workout[i % 4], name: (i + 1) + '. ' + student.workout[i % 4].name}))}, coach);
assert.ok(long.getNumberOfPages() > 3);
for (let page = 1; page <= long.getNumberOfPages(); page++) {
  assert.ok(long.internal.pages[page].join('\n').includes('Descanso'), 'Repeated table headings');
  assert.ok(long.internal.pages[page].join('\n').includes(page + ' / ' + long.getNumberOfPages()), 'Page number');
}
const huge = api.makeDocument({...student, workout: [{...student.workout[0], name: 'Exercício de mobilidade e estabilização '.repeat(300)}]}, coach);
assert.ok(huge.getNumberOfPages() > 2, 'A single long row can continue on other pages');
async function main() {
  const artifact = await api.prepare(student, coach);
  assert.equal(artifact.fileName, 'treino-joao-goncalves.pdf');
  assert.equal(artifact.blob.type, 'application/pdf');
  assert.equal(Buffer.from(await artifact.blob.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
  api.download(artifact); assert.equal(clicks[0], artifact.fileName);
  timers[0](); assert.ok(clicks.includes('blob:test'));
  assert.equal(api.canShare(artifact), false);
  await assert.rejects(api.share(artifact), /Baixe o PDF/);
  env.navigator.canShare = data => data.files[0].type === 'application/pdf';
  env.navigator.share = async data => {shared.push(data)};
  assert.equal(api.canShare(artifact), true);
  await api.share(artifact);
  assert.equal(shared[0].files[0].name, artifact.fileName);
  assert.equal(shared[0].files[0].size, artifact.blob.size);
  env.navigator.share = async () => {throw Object.assign(new Error('Canceled'), {name: 'AbortError'})};
  await assert.rejects(api.share(artifact), {name: 'AbortError'});
  // Failure to load the optional library is recoverable without reloading the app.
  const pending = [];
  const offline = {document: {createElement: () => ({remove() {}}), head: {appendChild: script => pending.push(script)}}};
  vm.runInNewContext(source, {window: offline});
  const failed = offline.PersonalProPDF.prepare(student, coach); pending[0].onerror();
  await assert.rejects(failed, /Tente novamente/);
  const retry = offline.PersonalProPDF.prepare(student, coach);
  assert.equal(pending.length, 2); offline.jspdf = jspdf; pending[1].onload();
  assert.equal((await retry).fileName, artifact.fileName);
  if (process.env.PERSONAL_PRO_PDF_REVIEW_DIR) {
    fs.mkdirSync(process.env.PERSONAL_PRO_PDF_REVIEW_DIR, {recursive: true});
    fs.writeFileSync(path.join(process.env.PERSONAL_PRO_PDF_REVIEW_DIR, 'treino-exemplo.pdf'), Buffer.from(doc.output('arraybuffer')));
    fs.writeFileSync(path.join(process.env.PERSONAL_PRO_PDF_REVIEW_DIR, 'treino-longo.pdf'), Buffer.from(long.output('arraybuffer')));
    fs.writeFileSync(path.join(process.env.PERSONAL_PRO_PDF_REVIEW_DIR, 'texto-longo.pdf'), Buffer.from(huge.output('arraybuffer')));
  }
  console.log('PASS: PDF A4; Portuguese accents; four prescription fields; legacy doses; zero rest; multipage rows; privacy; download; file sharing; canceled sharing; optional library failure and retry.');
}
main().catch(error => {console.error(error); process.exitCode = 1});
