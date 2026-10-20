# PAR-Q / Q-PAF — prévia

Fonte: Ministério da Saúde. Estratégias para o cuidado da pessoa com doença crônica: obesidade. Cadernos de Atenção Básica nº 38, 2014. Anexo F, p. 194 (página 195 do arquivo PDF).

URL: https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_doenca_cronica_obesidade_cab38.pdf

SHA-256 do PDF: `27b20532abe39a8ae15911ba19e43fcb07c7b42d75886ebaa49e6b63a4a02fb0`

As sete perguntas foram comparadas com o texto extraído do original; todas mantidas, inclusive “água pílulas” na pergunta 6. A página 134 refere aplicação de 15 a 69 anos. Não é o PAR-Q+.

## Fluxo

Aluno: Evolução → PAR-Q. Sete respostas obrigatórias sem pré-seleção e confirmação explícita de compartilhamento com o personal vinculado.

Personal: ficha → Avaliação e evolução. Respostas, autor, data e revisão explícita com observação opcional visível ao aluno. Cada envio guarda cópia da definição e data do servidor. Novas respostas preservam as anteriores. Revisão não é atestado ou liberação automática.

RLS restringe leitura aos participantes; sem escrita direta. RPC valida papel, vínculo, acesso do aluno e conteúdo. UUID de envio é reutilizado após falha; bloqueio síncrono contra clique duplo. Erros mantêm o formulário preenchido.

Prévia de interface em `/parq-preview.html`: usa o mesmo componente, sem gravar dados e sem login no aplicativo.

## Verificação

- Testes SQL no Supabase existente com usuários e registros temporários, revertidos integralmente por ROLLBACK.
- Validados: respostas incompletas/nulas recusadas; consentimento; definição salva; repetição idempotente; histórico; leitura das duas pontas; revisão restrita ao personal; proteção contra sobrescrita, terceiros, aluno expirado e acesso anônimo.
- Auditor de segurança sem novo apontamento para PAR-Q. Avisos preexistentes: objetos privados sem políticas e proteção contra senhas vazadas desativada.
- 83 testes existentes passaram antes dos testes específicos.
- Browser autenticado com contas reais e Android físico: não executados nesta rodada.
