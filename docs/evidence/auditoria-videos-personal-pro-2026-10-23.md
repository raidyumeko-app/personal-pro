> Estado mais recente, após as novas instruções do usuário: usar também outras referências, encaixar pelo movimento mostrado e deixar a revisão técnica final para completar os 220. Depois, o usuário exigiu que não houvesse vídeos repetidos. Resultado: **42 vídeos ativos para 42 exercícios, 6 excedentes repetidos guardados e 1 Superman sem correspondência**. O relatório atual é `video-assignments-2026-10-23.json`. Os estados abaixo ficam como histórico e não representam a configuração atual. Nenhum crédito novo foi gasto.

> Atualização posterior na mesma data: os 49 clipes Artlist estão restritos à galeria, sem vínculos automáticos. O relatório `video-recheck-2026-10-23.json` registra hashes, tempos e observações do MP4. A puxada YMove de UUID `5971eaa2-5264-49cc-99c2-1310305c5342` é unilateral e foi retirada da puxada com triângulo. A remada YMove com apoio na coxa foi retirada da ficha que exige banco. Há 14 originais YMove no resolvedor de prioridade (12 anteriores + goblet com halter + puxada unilateral). Zero créditos gastos.

# Personal Pro — auditoria de vídeos e correção de identidade (23/10/2026)
## Escopo e regras
- Alteração exclusiva da branch `feature/premium-visual-preview`. Não publicou na branch `main` nem modificou dados dos alunos.
- Proibição de gerar novamente ou cobrar créditos adicionais.
- Fontes originais aceitas para novas substituições: somente [YMove](https://ymove.app/free-exercise-videos), que autoriza uso comercial dos 25 vídeos gratuitos. Diferenciar **original YMove** de **vídeo gerado com referência YMove**.
- Identificação de 36 saídas foi reconstituída pela sequência dos lotes mais miniaturas, e NÃO é substituto para prompt original nem revisão cinemática de cada repetição.
- Supervisionar o treinamento usando as descrições; não apresentar vídeo de exercício diferente como demonstração aprovada.

## Resultados da auditoria
- **49 arquivos AI Artlist** preservados sem novos custos.
- **12 vídeos originais YMove** adicionados ao resolver por ID exato do catálogo.
- **12 arquivos AI não aprovados**, separados de associações ao aplicativo.
- **7 arquivos AI inconclusivos**: não associar variantes duvidosas.
- **30 arquivos AI** em revisão de movimento.
- **21 vínculos AI identificados** nos dados, dos quais **4** são substituídos pelos originais YMove; **17** AI permanecem no resolver como demonstração pendente de revisão.
- **29 exercícios** nesta integração têm um dos novos vínculos (YMove original ou vídeo AI), sem contar quaisquer mídias anteriores do aplicativo.
- Nenhum novo crédito consumido por estas correções.

## Fontes YMove adotadas na prévia
| Nome no aplicativo | Source ID do catálogo | Referência exata | Acesso |
|---|---|---|---|
| Supino reto com barra | `Barbell_Bench_Press_-_Medium_Grip` | Barbell Bench Press | [Vídeo YMove](https://ymove.app/api/free/dd7e706c-2086-4f4b-867f-d7fece2f720d) |
| Remada sentada na polia | `Seated_Cable_Rows` | Seated Cable Row close V bar | [Vídeo YMove](https://ymove.app/api/free/77976f52-b13a-4fd0-addf-f4404e3a8e95) |
| Elevação lateral com halteres | `Side_Lateral_Raise` | Dumbbell Lateral Raise | [Vídeo YMove](https://ymove.app/api/free/a16f0235-20eb-4306-b9cc-c01ae51b3b9b) |
| Rosca martelo | `Hammer_Curls` | Hammer Curls | [Vídeo YMove](https://ymove.app/api/free/b11e6c6f-b2e8-44ca-95dc-adf0dcd34426) |
| Agachamento livre com barra | `Barbell_Squat` | Barbell Back Squat | [Vídeo YMove](https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3) |
| Tríceps corda na polia | `Triceps_Pushdown_-_Rope_Attachment` | Cable Tricep Pushdown | [Vídeo YMove](https://ymove.app/api/free/3875dae4-14a6-4533-84d3-ef9acbadbaea) |
| Face pull | `Face_Pull` | Cable Rope Face Pull | [Vídeo YMove](https://ymove.app/api/free/d9b9cf47-c5ff-4672-b8a8-2fe5f4845231) |
| Elevação lateral na polia | `Standing_Low-Pulley_Deltoid_Raise` | Cable Lateral Raise | [Vídeo YMove](https://ymove.app/api/free/710d4aa4-e4ea-4fad-8930-a7b9bf582cae) |
| Rosca com corda | `Cable_Hammer_Curls_-_Rope_Attachment` | Cable Bicep Curl rope | [Vídeo YMove](https://ymove.app/api/free/f32940f7-7da6-4741-a72f-13e52c56a79c) |
| Cadeira extensora | `Leg_Extensions` | Leg Extension | [Vídeo YMove](https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c) |
| Mesa flexora | `Lying_Leg_Curls` | Lying Leg Curl | [Vídeo YMove](https://ymove.app/api/free/ee452f3b-4d5f-4deb-995e-64dd2a23f453) |
| Leg press | `Leg_Press` | Leg Press | [Vídeo YMove](https://ymove.app/api/free/d0bc669e-0d78-46f0-95f1-86503ab746e1) |

## Arquivos gerados (Artlist) e diagnóstico
| Exercício atribuído | Generation ID | Estado visual | Vínculo AI permitido? | Observações |
|---|---|---|---|---|
| Superman no solo | `01a16723-7ac0-761c-b26c-99246804f8b8` | não aprovado | Não | Pessoa com tronco em apoio sobre aparelho, corpo suspenso. Superman correto: deitar de barriga para baixo no chão e elevar braços, peito e pernas. |
| Remada sentada na máquina | `01a16723-7ac0-74c5-a6f7-4ff5bd6c48e1` | revisão pendente | Não | Máquina com puxada horizontal sentada; confirmar movimentos e equipamento. |
| Pulldown com braços estendidos | `01a16723-7abf-7014-b631-18ed9a68467a` | revisão pendente | Não | Na polia alta com braços estendidos; conferir movimento sem flexão excessiva do cotovelo. |
| Puxada frontal pegada supinada | `01a16723-7abb-7fd2-bf5e-3a09f5713a5f` | não aprovado | Não | Visual anatômico e pegada aparentemente pronada, não supinada. |
| Remada unilateral sentada na polia | `01a16723-7ab2-72bd-a8e4-98e73be7158e` | verificação inconclusiva | Não | Pessoa sentada diretamente no chão puxando cabo com um braço; não confirmar variante sem sequência original. |
| Remada curvada com dois halteres — pegada neutra | `01a16721-51ac-74fb-b0d9-d99dc93f5df1` | não aprovado | Não | Boneco anatômico com apoio no banco. Exercício pretendido: remada curvada bilateral com dois halteres, sem banco. |
| Remada curvada com barra pegada supinada | `01a16711-fe5e-73c1-8a30-444ec9d09499` | revisão pendente | Não | Tronco inclinado com barra; imagem não permite confirmar supinação. |
| Hiperextensão lombar | `01a16711-fe2d-7fda-945a-d04eccdfc6b1` | revisão pendente | Não — somente na galeria | Banco de hiperextensão e pés ancorados; conferir flexão/extensão do tronco. |
| Remada com halteres e peito apoiado no banco inclinado | `01a16711-fe2c-74f3-ad7e-04f5e2470651` | revisão pendente | Não — somente na galeria | Peito no banco inclinado com halteres; apoio dos pés/ângulo precisam de revisão. |
| Remada invertida em barra fixa baixa | `01a16711-fe28-77b9-be65-df4bfc55084d` | revisão pendente | Não — somente na galeria | Corpo sob barra baixa; conferir amplitude e apoio nos calcanhares. |
| Puxada frontal na polia com triângulo — pegada neutra | `01a16711-fe26-7349-9c06-4e5904c4c680` | não aprovado | Não | Barra longa no lugar de pegada triângulo; não confundir com puxada neutra. |
| Puxada unilateral na polia | `01a16711-fe21-718a-9136-cd207829a751` | revisão pendente | Não — somente na galeria | Uma mão no puxador da polia alta; verificar trajeto e apoio. |
| Remada cavalinho com barra apoiada e triângulo | `01a166fc-f950-7e22-b0a8-823dd8c330fa` | não aprovado | Não | A imagem mostra barra landmine sem a pegada triângulo exigida pela variante. Não usar como remada cavalinho com triângulo. |
| Encolhimento com halter | `01a166fc-f94a-7993-ab1d-0422fdd9d7ab` | revisão pendente | Não — somente na galeria | Dois halteres ao lado do corpo; conferir movimento dos ombros. |
| Encolhimento com barra | `01a166fc-f944-7ff8-a61d-43971aced830` | revisão pendente | Não — somente na galeria | Barra em pé à frente das coxas; conferir elevação dos ombros. |
| Barra fixa pegada supinada (chin-up) | `01a166fc-f93b-7bbc-a9c9-cfb6ad2412d0` | verificação inconclusiva | Não | Câmera traseira não confirma pegada supinada. Não vincular como chin-up até examinar os quadros completos. |
| Barra fixa (pull-up) | `01a166fc-f936-7912-a6cd-f655d1c9c3ac` | revisão pendente | Não — somente na galeria | Suspenso na barra com pegada pronada aparente; conferir repetição. |
| Remada baixa com triângulo na polia | `01a166fa-a70f-7535-8c29-3e1a73769c50` | revisão pendente | Não | Pessoa sentada com triângulo na polia; já existe vídeo YMove da variante, preferir o anterior. |
| Remada curvada com barra — pegada pronada | `01a166e0-924e-74e5-afb8-94fb19cb211e` | revisão pendente | Não — somente na galeria | Barra com tronco inclinado; confirmar pegada pronada e puxada ao tronco. |
| Puxada frontal na polia — pegada pronada aberta | `01a166e0-9224-70e9-9b26-f4e3733a4a06` | revisão pendente | Não — somente na galeria | Barra longa e pegada aberta aparente; conferir trajetória para o peito. |
| Puxada frontal na polia — pegada pronada fechada | `01a166e0-921d-79d3-b64b-88dbdb1ed267` | verificação inconclusiva | Não | A largura da pegada e a barra no quadro não confirmam a variante pronada fechada. Manter fora da demonstração. |
| Crossover unilateral na polia | `01a166e0-9212-77d6-9535-cf4ad239596d` | revisão pendente | Não | Um cabo acionado em posição incomum; confirmar unilateralidade e biomecânica. |
| Flexão com joelhos apoiados | `01a166e0-9210-7f5e-a016-d4ede78793d6` | não aprovado | Não | Imagem mostra joelhos suspensos e pernas estendidas: não é flexão com joelhos apoiados. |
| Flexão com pés elevados | `01a166e0-920f-7ac8-a287-13c417812d00` | revisão pendente | Não | Pés elevados em banco; confirmar flexão no vídeo. |
| Supino no chão com halteres | `01a166dc-f177-7939-82d3-30bb48524c00` | revisão pendente | Não | Deitado no chão com dois halteres; verificar repetições. |
| Pull-over com halter | `01a166dc-f14f-7a54-88dc-73c5ceb434a9` | verificação inconclusiva | Não | Quadro não permite distinguir pullover de supino com halter; verificar movimento do halter atrás da cabeça. |
| Supino declinado com halteres | `01a166dc-f142-7154-84b4-4d12e07cb9ae` | não aprovado | Não | Postura corporal parece suspensa/desencaixada do banco; anatomia e apoio incorretos. |
| Supino reto na máquina | `01a166dc-f142-7009-a00e-7dbe66d0ea5c` | revisão pendente | Não | Máquina de supino reconhecível; confirmar movimento. |
| Crucifixo declinado com halteres | `01a166dc-f137-7e4b-be95-3d00cda05f1c` | verificação inconclusiva | Não | Quadro mostra halteres acima do peito, mas não comprova movimento de crucifixo. Não vincular ainda. |
| Flexão diamante no solo | `01a166dc-f137-754f-937d-f5b5691893f8` | não aprovado | Não | Imagem mostra prancha sobre antebraços, não flexão diamante com mãos juntas. |
| Flexão com mãos elevadas | `01a166d5-f068-761b-a875-a78d72da2785` | revisão pendente | Não — somente na galeria | Apoio das mãos elevado; comparar amplitude da flexão no vídeo completo. |
| Crucifixo reto com halteres | `01a166d5-f02f-72fd-afec-85aa864d5418` | verificação inconclusiva | Não | Imagem dos dois halteres estendidos não demonstra abertura lateral do crucifixo reto. |
| Crucifixo inclinado com halteres | `01a166d5-f02d-7e29-bbdc-0d2d3691834f` | verificação inconclusiva | Não | Posição no banco inclinado não demonstra que é crucifixo; pode ter trajetória de supino. |
| Crossover na polia alta | `01a166d5-f02b-7b0d-8d3f-9db0f5a65ff7` | revisão pendente | Não — somente na galeria | Pessoa com dois cabos; confirmar altura das polias e trajetória. |
| Flexão de braço | `01a166d5-f02b-7abe-8a60-0e7fc2419152` | revisão pendente | Não — somente na galeria | Posição de prancha alta com mãos no chão; conferir movimento. |
| Voador (peck deck) | `01a166d5-f022-79a0-8fab-a281b5f2a6d5` | revisão pendente | Não — somente na galeria | Máquina peck deck identificada; confirmar execução completa. |
| Supino reto com halteres | `01a166c8-6444-73ae-9f17-ce3c15411bfc` | revisão pendente | Não — somente na galeria |  |
| Supino declinado com barra | `01a166c8-6439-7f01-b681-1ead4b5fde55` | revisão pendente | Não — somente na galeria |  |
| Supino inclinado com halteres | `01a166c8-6438-7300-b3ad-9757e611d7be` | revisão pendente | Não — somente na galeria |  |
| Supino inclinado com barra | `01a166c7-58d5-7041-b976-a208282304f1` | revisão pendente | Não — somente na galeria |  |
| Swing com kettlebell | `01a16683-0b0e-711e-9e10-3f4839fa171a` | não aprovado | Não | A miniatura não mostra kettlebell reconhecível. Não usar como swing. |
| Leg press 45 graus | `01a16680-7438-70b7-b44a-20ac140fb7cd` | não aprovado | Não | Video AI já não aprovado; referência YMove original está disponível no aplicativo para o Leg press. |
| Agachamento livre com barra | `01a1667d-1927-7e41-a630-de71694deb23` | revisão pendente | Não — somente na galeria |  |
| Tríceps francês com corda na polia | `01a1664a-c5aa-7503-81a1-fc0e55909c89` | não aprovado | Não |  |
| Rosca martelo simultânea com halteres | `01a16645-f0a3-7796-9ccb-37435abfd69d` | revisão pendente | Não — somente na galeria |  |
| Remada unilateral com halter — apoio na coxa | `01a16641-4b2e-7d0e-97b8-57d1bed1bb50` | revisão pendente | Não | Remada unilateral apoiada na coxa, diferente da ficha no catálogo que exige apoio no banco. Não vincular à variante do banco. |
| Crossover na polia média | `01a1663e-b770-7384-a42e-88afd3da5321` | não aprovado | Não | Já reprovado na conferência original por repetições extras. Não substituir pela variante alta do catálogo. |
| Supino reto com barra | `01a1663c-1b4b-7165-86f7-2900e96c1d1c` | revisão pendente | Não — somente na galeria |  |
| Remada baixa com triângulo | `01a16635-f9ca-7a24-b34e-14d960a59ef2` | revisão pendente | Não — somente na galeria | Referência original YMove; pegada triângulo. Movimento ainda requer revisão técnica. |

## Problemas que não devem se repetir
1. Não confiar em resumo de lote sem persistir mapa `nome/sourceId/referência YMove/generationId`.
2. No crossover, distinção **polia média** vs. **polia alta**.
3. Na remada unilateral, **apoio na coxa** vs. **apoio no banco**.
4. Puxada com **barra reta** não é puxada com **triângulo**.
5. Crucifixo com halteres não é supino, mesmo quando a miniatura mostra halteres estendidos.
6. Superman no solo deve ser realizado em decúbito ventral no chão e elevação dos braços e pernas, nunca flutuar com suporte no aparelho.
7. O uso de uma única miniatura não verifica arco de movimento, pegada completa nem o número de repetições.
8. Os vídeos originais YMove prevalecem onde identidade do exercício corresponde ao catálogo; os AI com erro ficam somente na galeria.

## Pendências técnicas objetivas
- A triagem posterior examinou quadros distribuídos pelo MP4 dos 49 clipes; os detalhes estão em `video-recheck-2026-10-23.json`. Isso não é revisão de todos os quadros nem homologação profissional. Os vídeos continuam sem aprovação de vínculo.
- Os arquivos AI continuam hospedados na Artlist por links de download/visualização, não foram migrados para um storage próprio do Personal Pro.
- Os demais exercícios do catálogo sem correspondência YMove gratuita necessitam da fonte/licença YMove apropriada para substituições; **não** utilizar WorkoutX/ExerciseDB como referência de novas gerações.
- A prévia não substitui a homologação do app principal.

## Evidência de publicação
- Galeria da prévia: `/videos-gerados.html`.
- Página de teste da reprodução: `/video-preview.html`.
- Resolvedores: `personal-pro-generated-videos.js` e `personal-pro-ymove-verified.js` (carregado depois do resolvedor AI).
