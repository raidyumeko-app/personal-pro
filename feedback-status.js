/* One read receipt per completed workout; no messaging or conversation state. */
(function(root){'use strict';
 function Status({React,seenAt,trainer=false,onMark,busy=false}){
  const h=React.createElement,seen=Boolean(seenAt),label=seen?(trainer?'Visto':'Seu personal viu'):(trainer?'Recebido · Marcar como visto':'Enviado · Ainda não visto');
  return h(trainer&&!seen?'button':'span',{
   className:'pp-feedback-receipt'+(seen?' is-seen':''),
   ...(trainer&&!seen?{type:'button',onClick:onMark,disabled:busy,'aria-label':'Marcar feedback como visto'}:{role:'status'}),
  },h('span',{'aria-hidden':true,className:'pp-feedback-check'},'✓✓'),h('span',null,busy&&!seen?'Salvando…':label));
 }
 root.PersonalProFeedback={Status};
})(window);
