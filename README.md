# Personal Pro

Aplicativo estático com React 18.3.1 compilado no HTML. O arquivo original fornecido foi `Personal-Pro.zip`; não há projeto-fonte JSX ou etapa de compilação. Os estilos originais foram preservados.

## Executar e publicar

Sirva esta pasta por HTTP. Na Vercel, use o projeto existente `personal-pro`, framework Other e sem comando de build. `vercel.json` define publicação estática da raiz.

Projeto Vercel autorizado: `prj_l2RIDJjV3XPwzumbndGzGwrx5s67`, time `team_B1cC85U00FbgdctDH2EcjyVu`. Publicado em https://personal-pro-liart.vercel.app a partir da branch main, commit c14097dde63ecf923a6537cc901f22d32ed65e10. Deploy dpl_F9ksHtBYowndc5TdkNw1yXmKKVkf, estado READY. A página inicial e cloud.js responderam HTTP 200 sem autenticação Vercel e são idênticos aos arquivos do repositório. A publicação foi feita pela API com fonte GitHub; o vínculo de atualizações automáticas por push foi confirmado: o commit de documentação 09ef2413c7440be3b49c3670ddc49b11d0829b7c gerou automaticamente o deploy de produção dpl_3popbXpKp9crgoSaVyGwUSCFAMdC, estado READY.

## Supabase existente

Projeto `lnlwkjsfcpeofhajqesh` (PersonalPro). `cloud.js` usa apenas URL e chave pública publishable. Nenhuma senha, chave secreta ou service_role é necessária no frontend.

A tabela `public.personal_pro_accounts` armazena perfil e alunos, incluindo exercícios, notas, medidas, histórico, check-ins e valores financeiros como JSON. RLS restringe leitura e escrita ao proprietário com `auth.uid() = user_id`. Acesso anônimo à tabela foi revogado. `schema.sql` documenta a tabela já existente; não reaplicar em produção.

Login, cadastro, confirmação, recuperação e redefinição de senha, renovação da sessão e logout usam Supabase Auth. Tokens ficam no sessionStorage da aba. Gravações são serializadas, com erro visível e nova tentativa. A demonstração é separada da conta.

Ao definir a URL de produção, configurar Site URL e Redirect URLs no Supabase Auth para permitir o retorno da confirmação e recuperação.

## Verificação realizada em 17/10/2026

- `node tests/cloud.test.cjs`: sintaxe JavaScript, login, gravação completa, restauração, ordem das gravações, erro e nova tentativa, logout, credenciais inválidas, confirmação e recuperação com efeitos duplicados do React. API simulada.
- PostgreSQL real: inserir, ler e atualizar como proprietário; preservar exercícios aninhados; bloquear leitura, atualização e inserção de outra conta. Testes revertidos com BEGIN/ROLLBACK; nenhum usuário ou registro de teste permaneceu.
- API HTTP real: Auth settings 200, e-mail habilitado e confirmação obrigatória; acesso anônimo à tabela bloqueado com 401.
- Assessor de segurança do Supabase: nenhum alerta. Comparação dos estilos: idênticos ao original.

Ainda pendentes: validação visual em navegador, fluxo real de confirmação/recuperação por e-mail, gravação autenticada pelo navegador e testes de produção. Os testes simulados e de PostgreSQL não substituem o fluxo completo.

## Fluxo do personal e do aluno nesta versão

- O personal cadastra os alunos, monta as fichas e compartilha o texto do treino pelo WhatsApp.
- Não há portal, login ou link individual do aluno nesta versão. O aluno não precisa acessar outro aplicativo.
- A presença/conclusão é registrada manualmente pelo personal: na tela Hoje, pelo botão “Marcar treino de hoje”; na ficha, pela data e pelo botão “Marcar treino”.
- O mesmo dia não é duplicado. Datas inválidas ou futuras são rejeitadas.
- Os registros são salvos na conta do personal com os demais dados dos alunos. Os textos do painel se referem a registros feitos pelo personal, não a check-ins automáticos do aluno.
- O código demonstrativo do portal e a função de copiar links fictícios foram removidos. A versão anterior permanece no histórico do GitHub.
- Não há monitoramento automático do aluno nem confirmação enviada diretamente por ele.

## Biblioteca de exercícios

Na ficha do aluno, toque em **Adicionar** na seção **Treino Atual**. A biblioteca contém 60 nomes de exercícios, distribuídos em 10 grupos: Peito, Costas, Ombros, Bíceps, Tríceps, Quadríceps, Posteriores e glúteos, Panturrilhas, Abdômen e core e Cardio.

- Busca por nome sem diferenciar maiúsculas, minúsculas ou acentos.
- Filtro por grupo muscular, combinado com a busca.
- Seleção de um exercício ou digitação de um nome personalizado.
- Campos para séries/repetições ou duração, carga/intensidade e descanso em segundos.
- Botão **Adicionar à ficha**, com o exercício salvo junto aos demais dados do aluno.
- Séries e carga não preenchidas ficam como **A definir**; o personal pode editar depois. Exercícios de cardio aceitam descanso zero.
- O catálogo contém nomes e grupos; não inclui vídeos nem montagem automática de treinos.

## Modelo comercial do Personal Pro

Regras definidas pelo proprietário em 17/10/2026. Esta seção trata do pagamento do usuário ao proprietário pelo uso do aplicativo.

- **Período gratuito:** os primeiros 30 dias são grátis.
- **Assinatura:** depois do período gratuito, R$ 19,90 por mês. O usuário também pode assinar antes de terminar o período gratuito.
- **Continuidade sem assinatura:** no 31º dia o aplicativo não bloqueia o uso; quem não optar por pagar continua utilizando com anúncios.
- **Programa de indicação:** ao assinar, o usuário vê um popup “Indique um amigo”.
- **Condição da recompensa:** indicar ou cadastrar um amigo não basta. O usuário que indicou recebe o benefício quando esse amigo também pagar pelo aplicativo.
- **Recompensa:** cada indicação que cumprir a condição concede 3 dias grátis de uso ao assinante que indicou, adiando sua próxima cobrança em 3 dias.
- **Exemplo:** uma indicação recompensada estende o intervalo até a próxima cobrança de 30 para 33 dias.
- **Limite mensal:** no máximo 5 indicações recompensadas, equivalentes a 15 dias extras por mês.

### Estado da implementação

As regras acima documentam o modelo comercial desejado. O aplicativo atual ainda não processa pagamentos nem implementa o popup de indicação, a atribuição de amigos indicados, a confirmação de pagamento deles, o crédito dos dias extras ou a exibição de anúncios. O botão de assinatura atual é uma simulação visual.

## Limitações existentes

Google Auth não está configurado no aplicativo. Assinatura é uma simulação visual sem processamento de pagamentos. O acompanhamento do aluno é manual, feito pelo personal; não há portal do aluno nesta versão. Não há fila offline nem resolução de edição simultânea entre dispositivos: prevalece o último estado completo salvo.
