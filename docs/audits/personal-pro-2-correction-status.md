# Auditoria corretiva — execução e pendências
Data: 2026-10-18
Branch: feature/finance-consolidation

## Implementado no código
- index.html carrega workout-session.js no ambiente de desenvolvimento.
- Motor de sessões já possui normalização, log de séries, conclusão, progresso e consulta de carga anterior.
- app.css recebeu atualização visual mobile-first.
- docs/migrations/pp-student-portal-draft.sql define proposta de tabelas segregadas, chaves e políticas RLS; **não aplicada**.

## Bloqueios que impedem anunciar o portal como pronto
- A UI atual não chama o motor de sessões.
- Não existe ainda adaptador seguro para persistir logs na nova estrutura.
- A migração precisa de revisão de SQL, ensaio isolado e testes multiusuário, incluindo tentativas de acesso cruzado.
- O processo de vinculação de contas de alunos exige convite seguro, expiração e revogação.
- Vídeos comerciais devem ter origem, licença e revisão profissional registradas.
- Testes Node e E2E Android ainda não foram executados neste ambiente.

## Testes obrigatórios antes de avançar
1. Criar personal A e B e alunos A1 e B1; A1 não pode ler nem modificar B1 ou conta do personal.
2. A1 pode ler somente suas atribuições e logs; não pode alterar prescrições.
3. Aluno sem vínculo não pode obter qualquer ficha.
4. A1 não pode modificar IDs de student/assignment/session para escapar de RLS.
5. Testar duas gravações concorrentes de carga e conclusão da sessão.
6. Treino sem vídeo mostra orientação textual e não tenta reproduzir mídia sem licença.
7. Validar telas em 320, 360, 390, 412 e 768px, teclado aberto, fontes ampliadas e Android.
8. Regressão: login, cadastro, PDF, agenda, financeiro, demonstração e recuperação de dados.

## Decisão de lançamento
Sem merge em main, sem publicação em produção e sem aplicar SQL no Supabase até validação e autorização explícita.
