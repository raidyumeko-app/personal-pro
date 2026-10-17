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

Na ficha do aluno, toque em **Adicionar** na seção **Treino Atual**.

- **180 exercícios em português**, organizados por grupo muscular.
- **Catálogo ampliado com 876 exercícios**, importado do Free Exercise DB. É uma coleção separada e pode conter equivalentes dos exercícios em português; não representa 1.056 exercícios distintos.
- No catálogo ampliado, os nomes permanecem no inglês original; instruções de execução, grupos, equipamentos e níveis estão em português. Há imagens em 873 registros e instruções em 871. Os demais mostram apenas os dados disponíveis.
- Busca sem diferenciar acentos ou maiúsculas. Termos comuns em português, como supino, agachamento e remada, também encontram nomes correspondentes em inglês.
- Filtros por grupo e equipamento; resultados exibidos em lotes de 40. Ao selecionar uma entrada ampliada, aparecem imagens, nível e instruções disponíveis.
- Os dados originais do catálogo são servidos pelo próprio aplicativo em `exercise-library.json`; as instruções em português ficam em `exercise-instructions.pt.json`, associadas pelo ID. Os nomes e demais dados originais não são alterados. Fotos dependem de internet e são carregadas do commit fixo do projeto original.
- **Séries (vezes), repetições ou duração, carga ou intensidade e descanso em segundos** são campos independentes, editáveis ao adicionar e ao editar um exercício da ficha.
- São aceitos valores como 3 séries, 8–12 repetições, 20 kg e 90 segundos. Duração e intensidade podem ser descritas em texto. Descanso aceita zero a 3.600 segundos.
- Prescrições antigas, como `3x12` ou `15 min`, continuam funcionando. A edição preserva os dados e registra a carga anterior quando ela muda; o timer é redefinido para o descanso atualizado.
- É possível cadastrar um exercício personalizado. Valores não definidos ficam como **A definir**; não há prescrição automática de séries ou carga.
- A ficha salva os quatro campos junto aos dados do aluno no Supabase; o texto de treino para WhatsApp mantém séries, repetições e carga.

Fonte e licença: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), Unlicense (domínio público). Proveniência, commit e licença completa em `THIRD_PARTY_NOTICES.md`. Não foram adicionados vídeos ou serviços pagos.

As instruções foram traduzidas localmente, com tradução automática OPUS-MT e ajustes pontuais de terminologia. Não houve revisão profissional integral das 3.736 instruções não vazias. A tradução preserva a quantidade e a sequência de passos, os números e as negações conferidas. O carregamento rejeita traduções ausentes ou incompletas. O catálogo funciona igualmente na demonstração e nas contas reais, sem serviço de tradução em tempo de uso.

Validação desta alteração: `node --test tests/*.test.cjs`. Cobre adicionar/editar os quatro campos, compatibilidade com fichas antigas, busca, filtros, paginação, detalhes ilustrados, exercício próprio, descanso zero e o fluxo de registros manuais.

## PDF da ficha para o aluno

Na ficha do aluno, em **Treino Atual**, toque em **PDF do treino**. A ficha deve conter pelo menos um exercício.

- O PDF A4 inclui nome do aluno, personal, estúdio (quando preenchido), data e tabela com exercício, séries, repetições/tempo, carga/intensidade e descanso.
- Usa os valores atuais da ficha e interpreta os treinos antigos no formato `3x12`. Preserva duração de cardio e descanso zero.
- Tabelas longas recebem páginas adicionais com cabeçalho e numeração. Campos extensos quebram linha.
- **Baixar PDF** salva o arquivo `treino-nome-do-aluno.pdf`.
- **Compartilhar PDF** aparece quando o navegador oferece compartilhamento de arquivos. O personal escolhe o WhatsApp e a conversa do aluno na tela do aparelho. O aplicativo não seleciona o destinatário nem envia automaticamente.
- No computador ou sem compartilhamento nativo, baixe o arquivo e anexe na conversa do WhatsApp. **Mandar treino** continua enviando o treino como texto.
- A geração acontece no aparelho. Notas internas, finanças e medidas não são incluídas. O arquivo não é enviado a um serviço de geração de PDF nem fica hospedado em link público.
- A biblioteca jsPDF 4.2.1 está incluída em `vendor/`, com licença MIT, e é carregada somente ao gerar o PDF. Não depende de CDN e não há serviço pago novo.

Verificação: `node --test tests/*.test.cjs`. Os testes cobrem o PDF real, acentos, formato legado, paginação, campos longos, download e compartilhamento simulado, cancelamento e nova tentativa após falha. PDFs de teste foram renderizados e conferidos visualmente. O seletor real de compartilhamento/WhatsApp varia por navegador e aparelho; não foi enviado arquivo a um aluno durante os testes.

## Demonstração e conta real

- **Abrir demonstração** usa somente dados de exemplo. O aviso permanece visível durante essa experiência.
- Ao entrar em uma conta real, inclusive gratuita, a demonstração é encerrada e o aviso desaparece.
- O status Pro é restaurado a partir de `user.app_metadata.personal_pro_subscription`, retornado pelo endpoint autenticado `/auth/v1/user`. O contrato usa `status: active` e `current_period_end` em ISO 8601 no futuro. Apenas infraestrutura administrativa/servidor deve definir esse metadado após validar o pagamento.
- Perfil, `user_metadata`, cliques e armazenamento local não concedem assinatura Pro. Assinatura vencida, cancelada ou com validade inválida não é reconhecida como ativa.
- Assinante ativo não recebe a opção/aviso de demonstração dentro da conta. Ao sair, o status em memória é limpo para não passar à conta seguinte.
- O botão **Assinar R$ 19,90** não simula mais uma ativação. O checkout e o servidor que confirma pagamentos e atualiza esse status ainda precisam ser integrados. Este ajuste cobre a apresentação do estado, não implementa cobrança ou autorização de recursos pagos no backend.

Validação: `node --test tests/*.test.cjs`, incluindo login/restauração com assinatura ativa simulada no retorno da API, saída da demonstração, troca de conta e rejeição de metadados editáveis. Não foi executado um pagamento real.

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

As regras acima documentam o modelo comercial desejado. O aplicativo atual ainda não processa pagamentos nem implementa o popup de indicação, a atribuição de amigos indicados, a confirmação de pagamento deles, o crédito dos dias extras ou a exibição de anúncios. O botão de assinatura informa que o pagamento ainda está indisponível e não ativa o plano.

## Limitações existentes

Google Auth não está configurado no aplicativo. Não há processamento de pagamentos; o botão de assinatura não ativa o plano. O acompanhamento do aluno é manual, feito pelo personal; não há portal do aluno nesta versão. Não há fila offline nem resolução de edição simultânea entre dispositivos: prevalece o último estado completo salvo.
