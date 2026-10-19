# Personal Pro — integração funcional da prévia

Escopo: somente `feature/premium-visual-preview`, sem alterações em `main` ou promoção para produção. Especificação do Notion relida em 19/10, incluindo a atualização de 13:34 UTC: **Personal Pro+ — Nutrição e Evolução**, um único produto opcional do aluno por R$ 9,90/mês. O profissional tem 30 dias gratuitos, plano de R$ 29,90/mês e opção gratuita sem bloqueio no dia 31.

## Implementação

- A aplicação React existente foi preservada. Biblioteca, editor A/B/C, modelos, agenda, financeiro, relatórios e PDF continuam utilizando os componentes e adaptadores existentes.
- Corrigidos erros de sintaxe em avaliações e no antigo módulo de demonstração. Acesso público agora usa autenticação real; não há entrada anônima em demonstração. O módulo antigo de nutrição foi substituído por uma ponte sem dados fictícios.
- Cadastro de profissional/aluno, gênero declarado persistido e ilustração correspondente. Convite de uso único, 128 bits aleatórios, hash no servidor, expiração de sete dias e validação do vínculo por RPC.
- Aluno recebe somente a projeção autorizada da própria ficha. Financeiro e anotações privadas do profissional não são enviados ao portal.
- Execução reutiliza o motor e a tela existentes: mídia compartilhada licenciada, séries/repetições/carga, descanso automático, registro por evento, retomada no servidor, conclusão, resumo, esforço e mensagem de incentivo do profissional. Revisões impedem sobrescrita silenciosa entre dispositivos.
- Avaliações preservam histórico; medidas têm salvamento explícito, data por região, silhueta de 580 px em tela própria e detalhes expansíveis. Peso, medidas e cargas alimentam gráficos reais em Evolução avançada. Dados básicos permanecem acessíveis ao aluno gratuito.
- Pro+ utiliza um único direito validado no servidor. Diário, fotos comprimidas, hidratação de 1 a 5 L em passos de 0,1 L, ingestão configurável, horários, plano alimentar e PDF original ficam privados do aluno. Plano, diário, água e importação têm navegação própria.
- PDF.js 6.4.299 extrai texto localmente, organiza títulos/horários identificados e exige conferência editável antes de ativar o plano. Não inventa alimentos, porções ou horários. Documento escaneado requer organização manual; não há OCR.
- Endpoint de validação Google Play implementado com correspondência de produto, conta, validade e confirmação no provedor. Falha fechada quando faltam credenciais. Registro de recibos e indicações é exclusivo do servidor; repetição não duplica crédito, máximo de cinco indicações/15 dias por ciclo. Créditos não alteram arbitrariamente datas do Google.

## Banco e preservação

Migrações aditivas criam tabelas `pp_*`, funções privadas e wrappers com privilégios mínimos. RLS cobre perfis, vínculos, sessões e nutrição. Bucket `pp-nutrition` é privado; somente o proprietário acessa seus arquivos. O profissional não pode consultar nem assinar URLs das fotos/dietas do aluno.

A tabela original `personal_pro_accounts` não foi migrada ou reescrita. Cópia de segurança restrita em `pp_private.account_backup_20261019`; comparação de conteúdo confirmou preservação da conta preexistente. Migrações SQL foram executadas e verificadas diretamente no projeto existente. Os arquivos SQL devem ser reconciliados com o histórico de migrações antes de uma futura aplicação via CLI; não reaplicar cegamente em um banco que já os recebeu.

## Verificação

- 56 testes Node passaram: regressões, montagem, biblioteca, tradução, agenda, financeiro, PDFs, autenticação/adaptador, recuperação de rascunhos, permissões Pro+, extração conservadora e recusa de pagamentos não configurados.
- Testes PostgreSQL em transações com rollback: isolamento de três contas, convite/reutilização, projeção sem financeiro, sessões, exercício fora da prescrição, revisão concorrente, esforço, parabéns, acesso premium e privacidade nutricional.
- Testes de cobrança em rollback: somente servidor concede direito, repetição de recibo não duplica benefício e seis amigos pagantes não excedem cinco créditos/15 dias.
- Navegador Chromium em viewport móvel 390×844, com Supabase real e contas temporárias: login, papéis, convite, prescrição, carga fracionada, registro, reload/retomada, conclusão, esforço, medidas, parabéns, hidratação de 2,7 L/300 ml, foto privada, extração de PDF, conferência e persistência após reload.
- Profissional recebeu as conclusões e enviou incentivo. Consultas às refeições e à assinatura de URL real do arquivo do aluno foram negadas ao profissional.
- Não houve teste em dispositivo Android físico, distribuição Play Store ou cobrança real. As contas/dados de QA são removidos antes da entrega.

## Dependências externas que continuam indisponíveis

1. **Google Play Billing real:** conta de serviço autorizada, package name, produtos cadastrados e credencial Supabase exclusiva do servidor. Variáveis exigidas: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, `ANDROID_PACKAGE_NAME`, `PLAY_TRAINER_PRODUCT_ID`, `PLAY_STUDENT_PLUS_PRODUCT_ID`, `SUPABASE_SERVICE_ROLE_KEY`. Nenhum segredo é enviado ao frontend. A ponte nativa de compras, restauração, RTDN/revogação e aplicação dos dias de indicação precisam da configuração Android/Google Play e teste licenciado; não estão certificados como operacionais.
2. **Publicidade:** provedor, conta e unidades de anúncio não foram fornecidos. A escolha gratuita é persistida, mas não há anúncios reais sendo exibidos.
3. **Lembretes:** funciona apenas a notificação no navegador com a aba aberta e permissão. Agendamento em segundo plano depende da implementação/permissões Android.
4. **PDF escaneado:** sem serviço OCR configurado; original e correções manuais são suportados, sem fingir leitura do que não foi extraído.
5. Advisor Supabase mantém o aviso preexistente de proteção de senhas vazadas desativada. Tabelas privadas de backup/recibos/convites não têm políticas de cliente deliberadamente; não são expostas.

A prévia é funcional para os fluxos descritos, mas não equivale a um aplicativo Android publicado nem à conclusão das integrações externas bloqueadas.
