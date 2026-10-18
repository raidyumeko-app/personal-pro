const test=require('node:test');const assert=require('node:assert/strict');const evidence=require('../evidence.js');
const base={id:'e1',title:'Exercicio',category:'exercise',sourceIds:['acsm-2026'],reviewedBy:'Profissional responsavel',reviewedAt:'2026-10-18',status:'approved',evidenceNotes:'Referencia verificada, aplicabilidade sujeita a revisao'};
test('exige referencia rastreavel',()=>assert.equal(evidence.validateEntry({...base,sourceIds:['inexistente']}).ok,false));
test('exige revisao profissional',()=>assert.equal(evidence.validateEntry({...base,reviewedBy:null}).ok,false));
test('rejeita video sem licenca comercial',()=>assert.equal(evidence.validateEntry({...base,category:'video',videoUrl:'https://example.org/v.mp4'}).ok,false));
test('rejeita prescricao nutricional individual',()=>assert.equal(evidence.validateEntry({...base,category:'nutrition',individualPrescription:true}).ok,false));
test('rejeita exercicio que exige liberacao',()=>assert.equal(evidence.validateEntry({...base,medicalClearanceRequired:true}).ok,false));
test('permite registro revisado com referencia',()=>assert.equal(evidence.validateEntry(base).ok,true));
test('filtra registros nao aprovados',()=>assert.equal(evidence.publishable([base,{...base,reviewedBy:null}]).length,1));

test('bloqueia registro sem aprovacao editorial',()=>assert.equal(evidence.validateEntry({...base,status:'draft'}).ok,false));
test('bloqueia registro sem justificativa tecnica',()=>assert.equal(evidence.validateEntry({...base,evidenceNotes:''}).ok,false));
