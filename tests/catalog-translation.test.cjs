const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../exercise-library.json'), 'utf8'));
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, '../exercise-instructions.pt.json'), 'utf8'));
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const from = html.indexOf('async function loadPersonalProCatalog(');
const until = html.indexOf('function hasActivePersonalProSubscription(', from);
const ctx = {};
vm.createContext(ctx);vm.runInContext(html.slice(from, until), ctx);
async function main() {
  assert.equal(Object.keys(translations).length, catalog.length);
  let steps = 0;
  for (const exercise of catalog) {
    const translated = translations[exercise.id];
    assert.ok(Array.isArray(translated), exercise.id);
    assert.equal(translated.length, exercise.instructions.length, exercise.id);
    exercise.instructions.forEach((original, index) => {
      if (original.trim()) {assert.ok(translated[index].trim(), exercise.id);steps++}
      assert.ok(!/[▁�]/.test(translated[index]), 'No tokenizer artifacts');
      assert.deepEqual(original.match(/\d+(?:[.,]\d+)?/g)||[], translated[index].match(/\d+(?:[.,]\d+)?/g)||[], 'Numbers and angles are preserved: '+exercise.id);
      if (/\b(do not|don.t|never|avoid|without)\b/i.test(original)) assert.ok(/\b(não|nunca|jamais|evit\w*|sem)\b/i.test(translated[index]), 'Negative guidance preserved: '+exercise.id);
    });
  }
  const requested=[];
  const fetcher = async url => {requested.push(url);return {ok:true,json:async()=>url.includes('instructions')?translations:catalog}};
  const localized = await ctx.loadPersonalProCatalog(fetcher);
  assert.equal(requested.length, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(localized.map(({instructions,...rest})=>rest))),catalog.map(({instructions,...rest})=>rest), 'Names, IDs, images, muscles, equipment and levels remain unchanged');
  assert.ok(localized[0].instructions[0].includes('Deite-se'));
  assert.equal(localized[0].name, '3/4 Sit-Up');
  assert.ok(html.includes('Instruções de execução em português'));
  assert.ok(!html.includes('Instruções originais em inglês'));
  await assert.rejects(ctx.loadPersonalProCatalog(async()=>({ok:false})),/indisponível/);
  const incomplete={...translations};delete incomplete[catalog[0].id];
  await assert.rejects(ctx.loadPersonalProCatalog(async url=>({ok:true,json:async()=>url.includes('instructions')?incomplete:catalog})),/incompleta/);
  const malformed={...translations,[catalog[0].id]:['only one step']};
  await assert.rejects(ctx.loadPersonalProCatalog(async url=>({ok:true,json:async()=>url.includes('instructions')?malformed:catalog})),/incompleta/);
  console.log('PASS: Portuguese instructions for every available step ('+steps+'); names and all other exercise fields unchanged; complete localized loader; missing/invalid translation and HTTP failures rejected.');
}
main().catch(error=>{console.error(error);process.exitCode=1});
