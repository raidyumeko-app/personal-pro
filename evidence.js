/* Personal Pro: catalogo de evidencias. Sem diagnostico, prescricao ou chamadas de IA. */
(function(root){
  "use strict";
  const sources=Object.freeze([
    {id:"acsm-2026",title:"ACSM - Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults",year:2026,url:"https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/",scope:"Treinamento resistido em adultos saudaveis",commercialReuse:"reference-only"},
    {id:"who-2020",title:"WHO Guidelines on Physical Activity and Sedentary Behaviour",year:2020,url:"https://www.who.int/publications/i/item/9789240015128",scope:"Atividade fisica populacional",commercialReuse:"permission-required"},
    {id:"ms-guia",title:"Guia Alimentar para a Populacao Brasileira",year:2014,url:"https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/guias-alimentares/guias-alimentares",scope:"Educacao alimentar geral",commercialReuse:"verify-before-reproduction"}
  ]);
  const byId=Object.fromEntries(sources.map(s=>[s.id,s]));
  function validateEntry(entry){
    if(!entry||typeof entry!=="object")return {ok:false,reasons:["Registro invalido"]};
    const reasons=[];
    if(!entry.id||!entry.title||!entry.category)reasons.push("Identificacao incompleta");
    if(!Array.isArray(entry.sourceIds)||!entry.sourceIds.length||entry.sourceIds.some(id=>!byId[id]))reasons.push("Fonte verificavel obrigatoria");
    if(!entry.reviewedBy||!entry.reviewedAt)reasons.push("Revisao profissional pendente");
    if(entry.status!=="approved")reasons.push("Aprovacao editorial pendente");
    if(!entry.evidenceNotes||typeof entry.evidenceNotes!=="string")reasons.push("Justificativa tecnica ausente");
    if(entry.category==="video"&&(!entry.videoUrl||entry.commercialLicenseVerified!==true))reasons.push("Video sem licenca comercial comprovada");
    if(entry.category==="nutrition"&&entry.individualPrescription===true)reasons.push("Prescricao nutricional individualizada nao autorizada");
    if(entry.category==="exercise"&&entry.medicalClearanceRequired===true)reasons.push("Requer avaliacao individual");
    return {ok:reasons.length===0,reasons};
  }
  function evaluateSuggestion(entry,context){
    const result=validateEntry(entry);
    const reasons=result.reasons.slice();
    if(!context||typeof context!=="object")reasons.push("Contexto do aluno ausente");
    else{
      if(context.professionalReview!==true)reasons.push("Revisao do personal obrigatoria");
      if(context.reportedPain===true||context.reportedInjury===true)reasons.push("Dor ou lesao relatada: requer avaliacao individual");
      if(context.medicalRestriction===true)reasons.push("Restricao de saude: nao sugerir automaticamente");
      if(context.ageGroup!=="adult")reasons.push("Regra limitada a adultos");
      if(context.equipment&&Array.isArray(entry?.requiredEquipment)&&entry.requiredEquipment.some(item=>!context.equipment.includes(item)))reasons.push("Equipamento indisponivel");
    }
    return {allowed:reasons.length===0,reasons,sourceLinks:Array.isArray(entry?.sourceIds)?entry.sourceIds.filter(id=>byId[id]).map(id=>({title:byId[id].title,url:byId[id].url})):[]};
  }
  function listSuggestions(entries,context){return (Array.isArray(entries)?entries:[]).map(entry=>({entry,assessment:evaluateSuggestion(entry,context)})).filter(item=>item.assessment.allowed)}
  function publishable(entries){return (Array.isArray(entries)?entries:[]).filter(e=>validateEntry(e).ok)}
  const api=Object.freeze({sources,validateEntry,publishable,evaluateSuggestion,listSuggestions});
  root.PersonalProEvidence=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
