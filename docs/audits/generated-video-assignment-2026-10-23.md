# Vínculos dos vídeos existentes — 23/10/2026

O usuário pediu que os arquivos gerados fossem colocados nos exercícios pelo movimento visível, usando descrições e outras referências além do YMove, com revisão técnica final após completar a produção dos 220. Em seguida, exigiu um vídeo por exercício.

- 49 arquivos Artlist preservados, sem geração ou crédito novo.
- 48 arquivos tiveram o movimento identificado para encaixe provisório; a escolha sem repetição mantém 42 ativos, em 42 exercícios.
- 6 excedentes do mesmo exercício foram guardados: puxada aberta (dois), remada com barra (um), barra fixa (um), flexão (um) e remada sentada (um).
- 1 arquivo permanece sem encaixe: o Superman mostra o corpo suspenso, sem correspondência com o exercício no solo.
- Nenhum arquivo ativo é reutilizado em outra ficha. IDs de exercício, URLs e hashes dos 42 arquivos são únicos. A verificação de URLs sobre o catálogo ativo inteiro também não encontrou reutilização.

Foram corrigidos nomes de miniatura: flexão com os joelhos fora do chão vai para flexão comum; apoio em antebraços vai para prancha; a remada com uma mão e um joelho no banco vai para remada unilateral com banco; a remada com mão na coxa tem ficha própria. Crossover médio não é vinculado à ficha de polia alta. Na puxada unilateral, o original YMove não é usado como triângulo.

O catálogo ativo ganhou somente as 11 fichas necessárias para os movimentos deste lote (141 escolhas no total). Não foram ativados arbitrariamente todos os 220 nem removidos os 130 anteriores. Os textos já preparados para essas fichas foram incorporados, e as variantes de apoio na coxa e crossover médio receberam descrição própria. As prescrições salvas não são regravadas.

`personal-pro-generated-videos.js` resolve por `sourceId` e escolhe um único arquivo. Não há seletor de tomadas repetidas nem de referências alternativas nos 42 exercícios com geração escolhida. Os arquivos excedentes continuam identificados no inventário para não serem perdidos. A galeria abre filtrada nos 42 vínculos sem repetição; a página de teste abre a ficha e descrição do arquivo escolhido.

A revisão técnica continua pendente, como solicitado. Observações reais de amplitude, apoio e equipamentos são mantidas em notas, sem apresentar o encaixe como homologação profissional. A disponibilidade de uma referência para comparação não prova que ela tenha sido usada na geração. Referências de vídeo comparadas incluem YMove e os vídeos locais existentes; tentativas de recuperar o antigo CDN de animações retornaram 403 e não são contadas como reprodução verificada. Também foram consultadas descrições primárias da ACE para distinguir apoios e pegadas.

Validação: 93 testes passaram. Testes verificam todos os vínculos ativos, descrições, nomes corrigidos, ausência de reutilização por URL/hash e gravação de séries após falha de vídeo. Os módulos e o HTML da página de teste foram verificados sintaticamente. Não foi executado navegador real nesta sessão porque o binário não está instalado; nenhuma verificação física Android é afirmada.

Escopo: branch `feature/premium-visual-preview`, prévia da Vercel, sem alteração de main, banco de dados ou contas de alunos.
