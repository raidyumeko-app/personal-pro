# Auditoria inicial — Personal Pro (19/10/2026)

Escopo: branch `feature/premium-visual-preview`. Revisão de código e configurações; **não é certificação de teste ponta a ponta**.

## Confirmado
- GitHub: branch isolada, último commit visual `257af5c9634bfeb10e068694ef5f15e0e2ee765e`.
- Vercel: deployment da branch `dpl_32M8uJPdDe5DZgfMyD9BNrTtXMRi`, status READY. URL: https://personal-c1514ccff-raidyumeko-9261.vercel.app
- Supabase existente: `lnlwkjsfcpeofhajqesh` (PersonalPro), ACTIVE_HEALTHY.
- Tabela `public.personal_pro_accounts`: RLS ativado, política `own_account` para `authenticated`, operação ALL.
- Advisor de performance Supabase: nenhum alerta retornado.
- Advisor de segurança: aviso `auth_leaked_password_protection` (proteção contra senhas vazadas desativada).
- Arquivos de integração: `cloud.js` referencia URL do Supabase e chave publicável, sem chave secreta observada no cabeçalho.
- O HTML é uma aplicação empacotada de ~339 KB, com scripts externos carregados.

## Achados e prioridades
1. **P1 — verificar persistência real do treino do aluno.** `workout-session-preview.js` se apresenta como visualização temporária, sem gravações na conta. Identificar fluxo real antes de substituir ou remover.
2. **P1 — testar operações autenticadas e isolamento de usuários.** RLS está ativado na tabela, mas não foram realizados testes de acesso com contas distintas. Confirmar condições da política, leitura/gravação e autorização por perfil.
3. **P1 — segurança de senhas.** Ativar proteção de senhas vazadas no Supabase Auth após avaliação da configuração.
4. **P2 — CSS concorrente.** `app.css`, `redesign.css`, `premium-visual.css` redefinem variáveis `--surface`, `--lime`, `--text`, `--border` e afins. Consolidar em tokens de design com escopo claro, após inspeção de regressão.
5. **P2 — resíduos de demonstração.** `wellness-demo.js` é carregado; HTML contém referências à demonstração. Mapear dependências antes de remover.
6. **P2 — mídia.** `exercise-media.js` lista vídeos, posters, autores e licenças, incluindo URLs wger. Verificar existência dos assets locais, disponibilidade, compatibilidade e atribuições. Não remover assets sem mapa de referências.
7. **P2 — tamanho/manutenção.** `index.html` contém JS/CSS empacotados inline. Planejar modularização sem alterar funcionamento.
8. **P2 — cobertura visual incompleta.** A branch recebeu uma camada de estilos, mas não contém ainda toda a experiência premium do aluno aprovada na prévia externa.

## Pendências de validação
- Navegação profissional e aluno, login/logout, recuperação de conta.
- Criar/editar/excluir alunos e treinos; salvamento e sincronização com Supabase.
- Registro de séries, timer, gráficos alimentados por dados reais.
- Agenda, PDFs, mídias, financeiro, pagamentos e indicações.
- Responsividade Android, erros de console, redes lentas, acessibilidade.
- Auditoria de arquivos órfãos por busca de referências antes de excluir.
- Testes de regressão e comparação visual das telas na preview.

## Segurança operacional
Não alterar produção, não executar exclusões, não migrar banco sem autorização. Validar tudo em preview. Este relatório é uma **auditoria inicial**, não aprovação para lançamento.


## Atualização — preparação para revisão profissional
- O projeto Vercel recebeu configuração `previewDeploymentsDisabled=true` para impedir novos deployments de preview enquanto a revisão ocorre. Reverter manualmente quando houver autorização explícita para publicar nova preview.
- Removidos do HTML os três botões que abriam/reiniciavam a demonstração sem cadastro. A lógica interna e os arquivos ainda permanecem temporariamente, porque alguns módulos também são referenciados por telas do aplicativo. Não tratar como remoção completa do modo demo.
- Alteração feita no commit `2ea0aea8511d10d8f2777f239aa7b6f7598d4cba`.
- Não foi solicitada nem executada publicação manual. O commit acima ainda **não** foi validado em navegador ou Vercel.
- Atenção: o painel de nutrição e vídeos usa `PersonalProWellnessDemo`; remover o arquivo sem migrar esses usos quebraria essas áreas.
- Revisão profissional necessária antes do merge: confirmar se há referências remanescentes ao modo demonstração, testar autenticação, persistência e mídias, consolidar CSS e validar a aparência de cada tela.
