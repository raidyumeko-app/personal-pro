# Personal Pro — produto integrado após pesquisa internacional
Data: 2026-10-18. Status: proposta de produto e arquitetura, não implementação.
Branch de desenvolvimento: feature/finance-consolidation. Produção protegida.

## Tese
O personal monta, o aluno executa, o aplicativo acompanha. Um fluxo simples em duas experiências (profissional e aluno) que combina orientação por vídeo, execução e registros com gestão do negócio.

## Referências e aproveitamento
- Trainerize: treino, hábitos, progresso, clientes e operação; atenção à complexidade e aos add-ons.
- TrueCoach: registros de treino, vídeos próprios do treinador, feedback e métricas.
- Everfit: fluxo enxuto, modelos e experiência do aluno.
- Jefit: registro de carga anterior, descanso, volume e progresso.
- Caliber/Future/Trainwell: relação treinador-aluno e revisão opcional da execução.
- ExRx: anatomia, variantes e precisão técnica; licenciamento formal obrigatório para reutilizar mídia.
- DAREBEE: clareza de progressões e instruções; proíbe republicação em aplicativos.
- Pixabay: imagens de apoio com análise caso a caso de licença e direitos de terceiros, não biblioteca instrucional pronta.
- Benchmarks brasileiros: apenas preço, comunicação e posicionamento comercial; não copiar arquitetura.

## Jornada do personal
Cadastro/avaliação -> objetivos e restrições -> montar treino a partir de modelo -> revisar exercícios e mídias -> atribuir calendário -> compartilhar acesso do aluno -> monitorar execução/adesão -> ajustar treino -> gerir pagamentos/agenda.
Separar tarefas em telas focadas e modais, sem formulário gigante.

## Jornada do aluno
Acesso seguro e simples -> treino de hoje -> demonstração do exercício -> séries/repetições/carga anterior -> cronômetro de descanso -> registrar séries e RPE opcional -> concluir -> feedback/check-in -> histórico.
PDF permanece como alternativa, não como experiência principal.

## Módulos e critérios de aceite
1. Biblioteca: taxonomia de músculos, equipamentos, níveis, contraindicações contextuais; campos de revisão técnica, origem, licença, validade e mídia; busca/filtros; fallback textual quando vídeo ausente.
2. Construtor: modelos, duplicação, blocos semanais, superséries, substituições, séries/reps/carga/descanso, PDF e atribuição.
3. Portal do aluno: acesso com autorização por treinador e aluno, treino atribuído, vídeos, logging de séries, cronômetro, histórico; não expor dados de outros alunos.
4. Evolução: sessões concluídas, adesão, carga anterior, volume e PR com ressalvas, medidas e fotos opcionais com consentimento.
5. Feedback: check-ins curtos, comentário; vídeo de execução apenas após projeto de consentimento, armazenamento, limite de tamanho, acesso, retenção e exclusão.
6. Gestão: agenda, financeiro e status da assinatura; cobrança real depende de provedor e conformidade da loja.
7. Demonstração: dados fictícios, acesso a fluxo representativo antes do cadastro, isolamento completo dos dados reais.
8. Evidências: publicar sugestões somente com revisão profissional e fonte verificável; nutricão educativa, sem prescrição automatizada individual.

## Dependências e bloqueios
- Nenhuma mídia de concorrentes pode ser copiada/hotlinkada. Obter licença comercial ou produzir vídeos originais com revisão profissional. Piloto com catálogo menor e aprovado antes de escala.
- Verificar LGPD, dados de saúde, fotos/vídeos de alunos, segurança de tokens, autorização por objeto e exclusão.
- Testar concorrência, persistência, RLS, sincronização e modo offline antes de prometer funcionamento pleno.
- Medir custo real de hospedagem/transcodificação/banda de vídeo, armazenamento, autenticação, notificações, pagamentos e suporte antes de prometer ilimitado a R$19,90.
- Google Play: revisar requisitos atuais de publicação, faturamento, políticas de saúde e privacidade antes de lançamento Android.
- A regra de publicação não muda: não fazer merge em main, deploy de produção ou alterações de banco de produção sem aprovação explícita.

## Ordem técnica de dependências (não exclusão de escopo)
Auditoria do código e testes -> modelo de dados e segurança -> biblioteca com direitos verificados -> construtor -> portal aluno/logging -> progresso/feedback -> financeiro/assinatura -> testes integrados Android -> revisão de lançamento.

## Indicadores de validação
Tempo para montar treino; % de alunos que abrem treino; conclusão de sessões; % de exercícios com mídia aprovada; erros de permissão; custo de vídeo por usuário ativo; retenção do profissional; tempo de suporte por aluno.

## Não adotar agora
Marketplace, rede social, lives internas, chat com IA, prescrição nutricional automática, sensores/avaliação de postura por IA, importação de mídias de terceiros sem autorização.
