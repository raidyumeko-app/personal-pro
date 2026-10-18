# Personal Pro

Aplicativo estático com React 18.3.1 compilado no HTML. O arquivo original fornecido foi `Personal-Pro.zip`; não há projeto-fonte JSX ou etapa de compilação. A interface usa tema claro em `app.css`, com cartões brancos e verde nos destaques.

## Executar e publicar

Sirva esta pasta por HTTP. Na Vercel, use o projeto existente `personal-pro`, framework Other e sem comando de build. `vercel.json` define publicação estática da raiz.

Projeto Vercel existente: `prj_l2RIDJjV3XPwzumbndGzGwrx5s67`, time `team_B1cC85U00FbgdctDH2EcjyVu`. Produção: https://personal-pro-liart.vercel.app. A branch `main` do repositório GitHub está conectada à publicação automática na Vercel.

## Supabase existente

Projeto `lnlwkjsfcpeofhajqesh` (PersonalPro). `cloud.js` usa apenas URL e chave pública publishable. Nenhuma senha, chave secreta ou service_role é necessária no frontend.

A tabela `public.personal_pro_accounts` armazena perfil e alunos, incluindo exercícios, notas, medidas, histórico, check-ins e valores financeiros como JSON. RLS restringe leitura e escrita ao proprietário com `auth.uid() = user_id`. Acesso anônimo à tabela foi revogado. `schema.sql` documenta a tabela já existente; não reaplicar em produção.

Login, cadastro, confirmação, recuperação e redefinição de senha, renovação da sessão e logout usam Supabase Auth. Tokens ficam no sessionStorage da aba. Gravações são serializadas, com erro visível, rascunho local separado por conta e nova tentativa. A demonstração é separada da conta.

Ao definir a URL de produção, configurar Site URL e Redirect URLs no Supabase Auth para permitir o retorno da confirmação e recuperação.

## Verificação realizada em 17/10/2026

- `node tests/cloud.test.cjs`: sintaxe JavaScript, login, gravação completa, restauração, ordem das gravações, erro e nova tentativa, logout, credenciais inválidas, confirmação e recuperação com efeitos duplicados do React. API simulada.
- PostgreSQL real: inserir, ler e atualizar como proprietário; preservar exercícios aninhados; bloquear leitura, atualização e inserção de outra conta. Testes revertidos com BEGIN/ROLLBACK; nenhum usuário ou registro de teste permaneceu.
- API HTTP real: Auth settings 200, e-mail habilitado e confirmação obrigatória; acesso anônimo à tabela bloqueado com 401.
- Assessor de segurança do Supabase: nenhum alerta. O tema claro substitui a paleta escura; os fluxos existentes foram mantidos.

Ainda pendentes: validação visual em navegador, fluxo real de confirmação/recuperação por e-mail, gravação autenticada pelo navegador e testes de produção. Os testes simulados e de PostgreSQL não substituem o fluxo completo.

## Fluxo do personal e do aluno nesta versão

- O personal cadastra os alunos, monta as fichas e compartilha o texto do treino pelo WhatsApp.
- Não há portal, login ou link individual do aluno nesta versão. O aluno não precisa acessar outro aplicativo.
- A presença/conclusão é registrada manualmente pelo personal: na tela Hoje, pelo botão “Marcar treino de hoje”; na ficha, pela data e pelo botão “Marcar treino”.
- O mesmo dia não é duplicado. Datas inválidas ou futuras são rejeitadas.
- Os registros são salvos na conta do personal com os demais dados dos alunos. Os textos do painel se referem a registros feitos pelo personal, não a check-ins automáticos do aluno.
- O código demonstrativo do portal e a função de copiar links fictícios foram removidos. A versão anterior permanece no histórico do GitHub.
- Não há monitoramento automático do aluno nem confirmação enviada diretamente por ele.

## Tema claro e montagem de treinos

- Fundo claro, cartões brancos, texto escuro e verde nos botões principais; avatares em tons suaves.
- A biblioteca tem acesso próprio na aba **Biblioteca**, com busca, filtros, fotos e explicações. Também abre pelo botão **Adicionar exercício da biblioteca**, dentro da ficha.
- O editor de treino aparece no início da ficha, seguido pelos dados de avaliação e anotações que já existiam.
- Cada aluno pode ter **Treino A, B e C**. Exercícios antigos, sem o campo `day`, aparecem em A; nenhum registro antigo precisa ser apagado ou regravado para isso.
- Cada cartão identifica séries, repetições/tempo, carga e descanso, com botões **Editar**, **Remover** e setas para mudar a ordem dentro do treino selecionado.
- **Duplicar treino** acrescenta uma cópia ao dia escolhido. **Duplicar ficha** acrescenta os três treinos à ficha de outro aluno. A cópia recebe IDs novos e não leva histórico de carga do aluno de origem; o destino mantém os exercícios e os demais dados que já possuía.
- Os modelos também são acrescentados ao treino selecionado, preservando os exercícios existentes.
- Na biblioteca, é possível escolher o aluno e o treino de destino para adicionar exercícios sem procurar primeiro a ficha.
- **Salvar treino**, **Ver PDF** e **Enviar texto** ficam agrupados. Contas reais mantêm o salvamento automático e oferecem confirmação manual de gravação. Na demonstração, salvar conserva o estado somente durante aquela experiência e informa isso ao usuário.
- O PDF e a mensagem de WhatsApp separam A/B/C. O diálogo de PDF permite visualizar, baixar e compartilhar onde o navegador suporta arquivos.
- Os dados A/B/C são armazenados no JSON de exercícios já existente. Não há alteração de schema, perda de registros ou migração destrutiva.

Validação: `node --test tests/*.test.cjs`; testes do tema em Chromium, fluxo demonstrativo com catálogo em português, reordenação, cópia A/B, edição e download de PDF real, em 360/390 px e desktop, sem erros JavaScript. A aparência da tela e a renderização do PDF foram conferidas. O salvamento autenticado continua coberto com API simulada; esta alteração não executou cadastro ou cobrança real.

## Refinamento do caminho principal

O foco da ficha é **escolher exercícios, definir a prescrição e preparar o PDF para o aluno**.

- A biblioteca tem dois passos: escolher movimento e prescrever. Depois de escolher, os resultados dão lugar aos quatro campos essenciais, dispostos em duas colunas. É possível trocar de exercício ou criar um personalizado.
- Ao adicionar dentro da ficha, a biblioteca permanece aberta e a busca recebe foco para o próximo exercício. **Concluir montagem** aparece na etapa de busca, fecha a biblioteca e devolve o foco ao PDF; a prescrição em andamento continua exigindo **Adicionar à ficha**, evitando que concluir pareça salvar um rascunho não adicionado.
- Fotos e explicações ficam em **Ver fotos e explicações de execução**. Observações, técnicas e substituições são opcionais e ficam recolhidas durante a inclusão. A exploração da biblioteca sem aluno selecionado continua abrindo a execução.
- Duplicação, modelos, plano semanal, versões, revisão e arquivamento estão reunidos em **Organizar e revisar ficha**, perto das ações principais, sem ocupar a tela com todos os controles abertos.
- **PDF para o aluno**, no cabeçalho, e **Ver PDF** priorizam o formato para celular. O diálogo identifica que é a ficha completa e oferece **Para celular** / **Para imprimir**. Fotos e instruções continuam em **Personalizar fotos e explicações**.
- A ação primária é compartilhar o arquivo quando o navegador suporta, ou baixar quando não suporta. **Visualizar PDF** continua disponível para conferir. A alternativa de mensagem textual foi identificada como **Enviar texto**, para não confundir texto e arquivo.

Validação: nove arquivos de testes automatizados; percurso em Chromium adicionando três exercícios com uma única abertura da biblioteca, campos independentes, retorno automático à busca, consulta de imagens, conclusão da montagem, PDF A5 com foto incorporada e troca para A4; conferência de funções avançadas e telas de 360/390 px e desktop. Nenhuma mensagem foi enviada a terceiros.

## Melhorias de conclusão do aplicativo

1. **Editar modelos:** modelos pessoais permitem renomear, mudar a descrição, adicionar/remover exercícios, editar dose, carga, descanso, técnica e substituições; arquivar e reativar. Modelos prontos permanecem disponíveis.
2. **Desfazer exclusão:** a última remoção de exercício oferece desfazer durante a sessão. Outras remoções também podem ser recuperadas pelo histórico de versões.
3. **Estado de salvamento:** indicador de salvando, salvo e pendente, com mensagem explícita se o navegador não permitir cópia local. A demonstração identifica armazenamento apenas na sessão.
4. **Versões:** até 20 estados anteriores por aluno, sem snapshots recursivos. É possível conferir a lista de exercícios antes de restaurar. A restauração preserva o estado atual como outra versão. Inclui plano semanal e duração; não substitui dados pessoais do aluno.
5. **Substituições:** até cinco alternativas por exercício, definidas pelo profissional; aparecem na ficha, nos modelos, no texto de WhatsApp e no PDF. Não há substituição automática nem prescrição algorítmica.
6. **Técnicas:** Tradicional, Supersérie, Bi-set e Circuito, com identificação de bloco. O profissional identifica quais exercícios são executados em sequência. As marcações acompanham modelos e exportações; o cronômetro existente continua manual.
7. **Plano semanal:** A/B/C pode ser associado a dias da semana, sem criar agendamento ou portal do aluno.
8. **Duração:** estimativa aproximada usa séries, repetições/duração e descansos, com transição entre exercícios. Valores sem quantidade usam um tempo padrão aproximado. O profissional pode substituir por uma duração planejada de 1 a 600 minutos por treino. Não representa medição da sessão nem prescrição automática.
9. **Explicações no PDF:** opção de incorporar instruções da biblioteca em português. Requer internet ao gerar; o arquivo final pode ser lido offline. Correspondências ausentes são informadas.
10. **PDF para celular:** A5 vertical, fonte maior e ficha em blocos, sem a tabela densa do A4. Pode combinar fotos e explicações. Fotos em nova página repetem o nome do exercício.
11. **Gráfico de cargas:** usa registros numéricos explícitos em kg; outras unidades e textos ficam na lista de histórico. São cargas prescritas, não execuções confirmadas pelo aluno.
12. **Arquivar alunos:** lista de ativos/arquivados e reativação, preservando dados. Arquivados não aparecem como destino de novos modelos ou da biblioteca, e não entram na contagem de ativos. Os registros financeiros existentes permanecem disponíveis.
13. **Exportação:** botão global baixa JSON com perfil, alunos, modelos, fichas e versões. Não inclui sessão, senha ou tokens. Não é um PDF para compartilhar com o aluno; contém os dados completos da conta. A recuperação de rascunho local é um fluxo separado.
14. **Conexão instável:** antes do envio, `cloud.js` tenta preservar um rascunho no localStorage, separado por ID da conta. Sucessos removem apenas o rascunho correspondente à gravação concluída, evitando apagar uma alteração posterior. Falhas mantêm a cópia e o evento de reconexão tenta novamente durante a mesma sessão. Ao reencontrar uma cópia no login, o aplicativo oferece baixar, recuperar ou manter o estado da conta, sem aplicar automaticamente o rascunho antigo. Não é um modo offline completo: abrir/autenticar o aplicativo e obter a biblioteca/fotos ainda depende da rede. Não há conciliação automática de alterações feitas em vários aparelhos.
15. **Guia:** três passos curtos mostram biblioteca, ficha e PDF; disponível na demonstração e pelo botão **Guia rápido**, com opção de pular.
16. **Acessibilidade e visual:** controles de formulários recebem nomes acessíveis; diálogos prendem a navegação Tab, fecham com Escape quando possuem comando de fechar/cancelar e devolvem o foco. Há foco visível, controles de toque, tratamento de nomes longos e revisão em 360/390 px e desktop. Isso é uma revisão prática dos fluxos, não uma certificação WCAG.

Todos os novos dados usam os documentos JSON já existentes na conta, sem nova tabela, migração destrutiva ou serviço pago.

Validação desta etapa: nove arquivos de testes automatizados; Chromium com demonstração completa, modelos, arquivos, versões, desfazer, plano semanal, gráfico, backup, guia e PDF móvel com fotos e instruções; teste de cliente cloud real no navegador com HTTP simulado para falha, reconexão e recuperação após recarga; PDFs A4/A5 renderizados e conferidos. Fotos usadas no teste de navegador foram as imagens originais baixadas previamente da fonte e servidas pela rota de teste. A publicação é conferida pela versão pronta da Vercel e correspondência dos arquivos servidos. Não foram criadas contas reais nem enviados arquivos a alunos nesta etapa.

## Modelos pessoais, revisão e busca de alunos

- **Salvar como modelo**, na ficha, permite guardar a ficha completa A/B/C ou somente o treino selecionado. Nome obrigatório (até 80 caracteres), descrição opcional (até 240). Os modelos ficam em `profile.workoutTemplates` e aparecem antes dos modelos prontos na aba **Modelos**. Nomes repetidos entre modelos pessoais são recusados sem sobrescrever.
- Um modelo salva apenas a prescrição dos exercícios: nomes, divisão A/B/C, séries, repetições, carga, descanso, fonte da foto e orientações. Dados pessoais, registros de presença e histórico de cargas não são copiados. Modificações posteriores na ficha de origem não alteram o modelo.
- Aplicar ficha completa preserva A/B/C. Para modelos de um dia ou modelos prontos, escolha **Treino de destino do modelo**. Os exercícios são acrescentados, com IDs novos, preservando os anteriores no destino. Depois é possível ajustar qualquer prescrição.
- **Revisão do treino** mostra a última alteração e permite definir **Próxima revisão**. A data sinaliza revisão agendada, hoje ou pendente na ficha e na lista de alunos. **Marcar treino revisado** registra a revisão e limpa o agendamento anterior; a próxima data pode ser definida em seguida. Não há envio de notificações.
- A última alteração é registrada ao modificar os exercícios, a ordem ou aplicar/copiar modelos/fichas. Fichas antigas sem registro não recebem uma data presumida. Datas de revisão ficam junto ao aluno (`workoutReviewDate`, `workoutReviewedAt`, `workoutUpdatedAt`).
- A busca da aba **Alunos** ignora acentos e espaços extras, aceita partes do nome em qualquer ordem, mostra a contagem, informa ausência de resultados e permite **Limpar busca**.
- Todos esses fluxos funcionam na demonstração, com duração restrita à experiência demonstrativa. Contas autenticadas usam o salvamento existente, sem alterações de esquema.

## Favoritos, orientações e evolução

- A estrela em cada exercício adiciona/remove um favorito. **Ver favoritos** filtra o catálogo; a mesma fonte é reconhecida entre os catálogos português/ampliado. Favoritos ficam no perfil da conta (`profile.favoriteExercises`), usando o salvamento existente. Na demonstração, duram apenas a sessão demonstrativa.
- **Observações do exercício** está disponível ao adicionar e editar, até 2.000 caracteres. Aparece no cartão, no PDF e no texto de WhatsApp. É diferente das notas internas do aluno, que continuam privadas.
- **Histórico de cargas** em cada cartão mostra as alterações de carga prescrita com data/hora. Registros antigos sem data são identificados. Alterar somente observações não cria nova entrada. Não representa automaticamente uma carga executada pelo aluno.
- Novos exercícios com carga recebem o registro inicial. Copiar fichas/dias preserva as orientações e a carga prescrita, sem transferir o histórico anterior.
- No celular, campos têm fonte de 16 px, botões de toque maiores e diálogos de edição/PDF com rolagem interna.

## Biblioteca de exercícios

Abra a aba **Biblioteca** ou, na ficha do aluno, toque em **Adicionar exercício da biblioteca** na seção **Treino Atual**.

- **180 exercícios em português**, organizados por grupo muscular. **136 possuem fotos e instruções em português**, associadas por variação/equipamento ao catálogo Free Exercise DB; 44 permanecem disponíveis sem foto nesta fonte. Os nomes em português são preservados. Fotos são carregadas da fonte pública, com aviso caso estejam indisponíveis.
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

Na ficha do aluno, em **Treino Atual**, toque em **Ver PDF**, confira o resumo e escolha **Gerar ficha**. A ficha deve conter pelo menos um exercício.

- O PDF A4 inclui nome do aluno, personal, estúdio (quando preenchido), data e tabela com exercício, séries, repetições/tempo, carga/intensidade, descanso e orientações de cada exercício.
- **Incluir fotos no PDF** alterna entre compacto (padrão, sem downloads de fotos) e ilustrado. Até duas posições corretas de cada exercício são incorporadas ao arquivo, preservando a proporção. O PDF recebido pode ser aberto sem internet. A geração ilustrada precisa de internet para obter as fotos.
- Fotos ausentes, downloads com falha e indisponibilidade da fonte geram avisos, mantendo a ficha utilizável. Exercícios personalizados sem correspondência não recebem uma foto aproximada. O histórico de cargas não é exportado.
- Usa os valores atuais da ficha e interpreta os treinos antigos no formato `3x12`. Preserva duração de cardio e descanso zero.
- O PDF organiza os exercícios por Treino A/B/C. Tabelas longas recebem páginas adicionais com cabeçalho e numeração. Campos extensos quebram linha.
- **Baixar PDF** salva `treino-nome-do-aluno.pdf` ou `treino-nome-do-aluno-ilustrado.pdf`, conforme a opção.
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


## Revisão de conteúdo e consistência — 18/10/2026

- Mais de 700 trechos das explicações receberam ajustes de português e terminologia. Dezessete exercícios frequentes tiveram passos reescritos com referência ao original. Nomes, sequência, números e orientações negativas foram preservados; medidas originalmente em polegadas permanecem identificadas como polegadas.
- Conferidas as posições das fotos dos 136 exercícios associados à lista em português. Corrigidas as associações de remada invertida e flexão inclinada. Prancha e a variante original de flexão inclinada exibem apenas a posição correspondente selecionada. O PDF prioriza a associação corrigida mesmo em fichas com identificador antigo.
- Os quatro modelos iniciais são exemplos editáveis, com frequência a definir e sem cargas arbitrárias. Os modelos personalizados e as fichas existentes são preservados.
- Mensagens específicas para nome ausente, destino não selecionado, descanso inválido e falha de carregamento. Fotos com falha oferecem nova tentativa. Descanso aceita de 0 a 3600 segundos.
- Ajustada a quebra de nomes longos no cabeçalho de continuação do PDF para celular.

Verificação: 11 arquivos passaram em `node --test tests/*.test.cjs`. Percurso em Chromium com catálogo lento e indisponível, nova tentativa de catálogo e foto, correspondências corrigidas, modelos editáveis, ficha vazia, nomes longos, descanso zero/inválido e download do PDF. Larguras de 320, 360, 390 e 1440 px conferidas sem transbordamento do diálogo e sem erros JavaScript. PDFs A4 e A5 com 1 e 60 exercícios foram gerados, renderizados e conferidos visualmente.


## Ferramentas para montar e revisar a ficha

Disponíveis também na demonstração:

1. **Trocar por equivalente**, no cartão do exercício, lista opções do mesmo grupo e tipo de movimento, priorizando o mesmo equipamento. A escolha é manual. Séries, repetições, descanso e treino são mantidos. Carga, histórico de carga, alternativas e orientações específicas são redefinidos para não atribuir dados de outro movimento; a versão anterior permanece no histórico da ficha. Sem correspondência suficiente, use a biblioteca.
2. **Comparar ficha anterior e atual**, junto às ações da ficha, destaca alterações, adições e remoções, incluindo séries, repetições, carga, descanso e treino. É possível escolher uma versão do histórico. O último salvamento explícito vira a referência para a próxima comparação; nas fichas antigas, a primeira versão disponível é a referência inicial.
3. **Ver PDF** abre uma revisão por treino A/B/C com contagem de exercícios, duração planejada/estimada e campos a definir. **Corrigir** abre o exercício; **Gerar ficha** permite continuar com campos pendentes. Fotos e formato continuam personalizáveis antes da geração.
4. **Filtrar por objetivo**, na biblioteca, organiza movimentos em Força, Mobilidade e Condicionamento. A classificação usa as categorias do catálogo original e equivalências dos nomes em português; carga, volume e contexto continuam definindo a prescrição. Equipamento também pode ser filtrado no catálogo em português.
5. **Organizar e revisar ficha → Ajustar vários exercícios** ativa seleção nos cartões. Selecione individualmente ou todo o treino visível, defina descanso e/ou destino A/B/C e aplique. Descanso zero é válido; valores fora de 0–3600 são rejeitados. As demais prescrições e os exercícios não selecionados permanecem iguais.
6. **Organizar e revisar ficha → Identidade do profissional no PDF** configura nome, estúdio, contato e logo. PNG, JPEG e WebP de até 3 MB são processados localmente e reduzidos para armazenamento no perfil. O contato e o logo aparecem em A4 e no formato para celular. A logo pode ser removida; URLs externas não são carregadas como logo.

Verificação: 12 arquivos de testes automatizados, percurso em Chromium das seis ferramentas, conferência de telas de 320/390/1440 px e PDFs A4/A5 renderizados com identidade do profissional. Não foram adicionados serviços pagos.
