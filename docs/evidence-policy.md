# Base de evidencias - Personal Pro (desenvolvimento)

Esta base e um **controle de publicacao**, nao um motor de prescricao. A inclusao de uma fonte nao valida automaticamente cada exercicio ou regra. Nenhuma sugestao clinica ou nutricional individual deve ser gerada sem revisao profissional.

## Fontes verificadas em outubro de 2026
- ACSM, posicionamento de 2026 sobre treinamento resistido em adultos saudaveis: https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/
- OMS, diretrizes de atividade fisica de 2020: https://www.who.int/publications/i/item/9789240015128 (CC BY-NC-SA; uso comercial requer permissao).
- Ministerio da Saude, Guia Alimentar: https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/guias-alimentares/guias-alimentares (confirmar direitos antes de reproduzir conteudo).

## Politica de publicacao
1. Cada registro deve ter identificador, titulo, categoria, fonte rastreavel, revisor e data.
2. Videos exigem URL e verificacao documental da licenca comercial antes de disponibilizar.
3. Prescricoes nutricionais individualizadas nao sao publicadas por este modulo.
4. Exercicios marcados como dependentes de avaliacao individual nao sao publicados automaticamente.
5. Registrar autoria, revisao, versao, data de revisao e evidencia por recomendacao futura.
6. O personal revisa qualquer proposta de treino antes de compartilhar com aluno.
7. Sem chat e sem API de IA neste modulo.

## Estado
Modulo evidence.js isolado, com testes de unidade; **ainda nao conectado a interface nem com conteudo de exercicios aprovado**. Nenhum video foi copiado. Para ativar a biblioteca, produzir/licenciar midias e obter revisao de profissional habilitado. Nao aplicar migracoes de producao nesta etapa.

## Fluxo de revisao e publicacao
- `draft`: fonte cadastrada, conteudo nao publicado.
- `in_review`: profissional habilitado confere aplicabilidade, seguranca e evidencia.
- `approved`: registro contem `reviewedBy`, `reviewedAt`, `evidenceNotes` e `sourceIds` validos.
- Conteudos de video so passam com `commercialLicenseVerified: true` e `videoUrl`.
- O motor `evaluateSuggestion` exige contexto adulto, revisao do personal e verifica alertas de dor, lesao, restricoes e equipamento. Ausencia de sinalizacao nao equivale a avaliacao clinica.
- O modulo permanece **desacoplado da interface** ate que existam registros de exercicios revisados e direitos de video comprovados. Nao apresentar catalogo generico como se fosse validado.
