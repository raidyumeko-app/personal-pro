# Auditoria técnica — Personal Pro 2.0 — 2026-10-18

Escopo: inspeção estática remota de arquivos GitHub da branch feature/finance-consolidation, comparação com main e estado do deploy Vercel. Não houve execução de suíte local, navegação em browser, emulação Android ou teste de permissões em Supabase. Não confundir status READY de build com testes de funcionalidade.

## Evidência observada
- Compare main...feature/finance-consolidation: 49 commits à frente, 0 atrás, 22 arquivos alterados; inclui documentação, app.css, index.html, student-sections.js, evidence.js, workout-session.js e testes.
- Vercel: último deploy preview dpl_JCHCct16hvM1qb7pCPBANb9SeAVc READY, commit 5bb0cbb216bdc3ca4082cae58b23d0e8ca3f0d72, target null. Não é deploy production.
- index.html ~335445 caracteres, React compilado inline; sem referência a PersonalProWorkoutSession, logo o novo motor de sessões ainda não foi carregado nem conectado ao UI.
- workout-session.js: normalização, log de séries, progresso, conclusão, carga anterior e bloqueio de mídia sem sinalização de direitos. Sem armazenamento, autenticação ou autorização.
- tests/workout-session.test.cjs contém testes escritos, não executados nesta auditoria.
- schema.sql: public.personal_pro_accounts(user_id,profile jsonb,students jsonb) com RLS de proprietário da conta. Não fornece autorização específica para login do aluno. NÃO expor JSON integral ao aluno por acesso direto.
- cloud.js: sincronização do conjunto profile/students por upsert, cópia local pendente; concorrência entre dispositivos e sobrescrita merecem testes de integração.
- app.css ~34147 caracteres: acréscimo visual PP2 sobre regras anteriores; não houve inspeção visual em tamanhos de tela.
- evidence.js: regras editoriais e direitos de mídia; catálogo existente não está validado item a item.

## Achados priorizados
P0 — Novo módulo de sessão desconectado da UI e do banco; não alegar portal do aluno concluído.
P0 — Definir arquitetura de autorização por aluno e tabelas separadas com RLS antes de criar links de acesso; não abrir profile/students JSON ao aluno.
P1 — Testar escrita concorrente/sincronização e recuperar rascunhos sem perda.
P1 — Direitos comerciais, revisão profissional, consentimento e retenção de vídeos pendentes.
P1 — Execução automatizada de testes Node, navegador e Android; READY Vercel só atesta build.
P2 — Cascata CSS, layout 320/360/390/412px, teclado Android, áreas seguras, zoom de fonte, contraste e toque 44px; validar empiricamente.
P2 — Reduzir complexidade do index.html com extração gradual e testes de regressão.
P2 — Modelar estados vazios, erros de rede, sessão expirada, sem vídeo, carga zero e séries parciais.
P3 — Medir performance e custos de streaming/armazenamento antes de prometer biblioteca ilimitada.

## Plano de correção
1. Executar suíte Node em clone e inspecionar falhas, documentando resultado.
2. Isolar módulo de treino e adaptador de armazenamento com testes unitários e integração, mantendo demo com dados fictícios.
3. Desenhar tabelas aluno, atribuições, sessões e logs com RLS e políticas de acesso por treinador/aluno, sem migrar banco de produção.
4. Conectar UI em fluxo de treino de aluno somente após persistência e autorização testadas.
5. Testar CSS em múltiplos breakpoints e Android; consolidar duplicações sem alterar identidade visual.
6. Auditar media licensing e LGPD; fazer piloto com vídeos originais/revisados.
7. Fazer E2E de cadastro -> treino -> registro -> progresso -> exportação, e regressão de agenda, financeiro e login.
8. Preparar preview compartilhável para homologação, sem deploy em main ou mudanças no banco de produção.

## Estado
Auditoria estática inicial concluída; testes dinâmicos e revisão de segurança em execução real ainda não realizados. Nenhuma alteração em produção.
