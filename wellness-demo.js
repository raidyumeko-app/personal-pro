/* Compatibility export for legacy navigation. No sample data or video uploads. */
(function(root){'use strict';
 function Panel({React:R}){return R.createElement('section',{className:'portal-card'},R.createElement('h2',null,'Nutrição privada do aluno'),R.createElement('p',null,'O aluno acessa o próprio diário na sua conta. O profissional não tem acesso a refeições, fotografias ou dietas.'))}
 function Videos({React:R}){const h=R.createElement;return h('section',{className:'portal-card'},h('h2',null,'Biblioteca de demonstrações'),h('p',null,'Confira a execução dos movimentos cadastrados.'),root.PersonalProMedia.entries.map(ex=>h('article',{key:ex.id,className:'portal-card'},h('h3',null,ex.names[0]),h('video',{src:ex.video.url,poster:ex.poster,controls:true,playsInline:true,preload:'none',style:{width:'100%',borderRadius:16}}),ex.video.licensed && /^CC BY/.test(ex.video.license||'') && h('p',null,ex.video.author+' · ',h('a',{href:ex.video.licenseUrl,target:'_blank',rel:'noopener noreferrer'},ex.video.license)))))}
 root.PersonalProWellnessDemo={Panel,Videos};
})(window);
