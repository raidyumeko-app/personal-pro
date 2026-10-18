/* Actual trainer home: action-first dashboard, uses live app state and callbacks. */
(function(root){'use strict';
function Dashboard({React:R,students=[],onStudents,onNewStudent,onWorkout,onLibrary,onModels,onFinance,onStudentPreview,demo=false}){
 const e=(t,p,...c)=>R.createElement(t,p,...c),active=students.filter(s=>!s.archived),pending=active.filter(s=>s.todayStatus!=='done'),withWorkout=active.filter(s=>Array.isArray(s.workout)&&s.workout.length),attention=active.filter(s=>(Number(s.lastCheckinDays)||0)>=7);
 const action=(icon,title,sub,fn,featured)=>e('button',{type:'button',className:'pp-home-action'+(featured?' pp-home-featured':''),onClick:fn},e('span',{className:'pp-home-action-icon','aria-hidden':true},icon),e('span',null,e('strong',null,title),e('small',null,sub)),e('span',{className:'pp-home-arrow','aria-hidden':true},'↗'));
 return e('section',{className:'pp-home','aria-label':'Central de trabalho do profissional'},
 e('header',{className:'pp-home-hero'},e('span',{className:'pp-home-overline'},'CENTRAL DO PROFISSIONAL'),e('h2',null,'Seu trabalho, mais leve.'),e('p',null,'Organize treinos, acompanhe alunos e resolva o que importa sem procurar em várias telas.'),e('div',{className:'pp-home-hero-foot'},e('span',null,demo?'Ambiente de demonstração':'Seu espaço de trabalho'),e('span',null,'PERSONAL PRO  ↗'))),
 e('div',{className:'pp-home-stat-row'},e('div',null,e('small',null,'ALUNOS ATIVOS'),e('strong',null,active.length)),e('div',null,e('small',null,'COM TREINO'),e('strong',null,withWorkout.length)),e('div',null,e('small',null,'ATENÇÃO'),e('strong',null,attention.length))),
 e('div',{className:'pp-home-section-title'},e('h3',null,'Acesso rápido'),e('span',null,'ESCOLHA UMA TAREFA')),
 e('div',{className:'pp-home-action-grid'},action('＋','Novo aluno','Cadastrar e começar',onNewStudent,true),action('▤','Montar treino','Editar séries e exercícios',onWorkout,true),action('⌕','Biblioteca','Encontrar movimentos',onLibrary),action('▦','Modelos','Reaproveitar treinos',onModels),action('◷','Agenda e alunos','Consultar atendimentos',onStudents),action('↗','Financeiro','Consultar recebimentos',onFinance)),
 e('div',{className:'pp-home-section-title'},e('h3',null,'Acompanhamento'),e('span',null,'DADOS DO SEU PAINEL')),
 e('div',{className:'pp-home-follow'},e('div',null,e('strong',null,pending.length+' alunos'),e('p',null,'Sem treino marcado como concluído hoje')),e('button',{type:'button',onClick:onStudents},'Ver alunos →')),
 attention.length>0?e('div',{className:'pp-home-alert'},e('strong',null,attention.length+' alunos precisam de atenção'),e('p',null,'Sem registro de atividade há 7 dias ou mais, conforme os dados disponíveis.'),e('button',{type:'button',onClick:onStudents},'Verificar alunos')):null,
 demo&&onStudentPreview?e('button',{type:'button',className:'pp-home-student-link',onClick:onStudentPreview},'Experimentar a visão do aluno  ↗'):null);
}
root.PersonalProDashboard={Dashboard};
})(window);
