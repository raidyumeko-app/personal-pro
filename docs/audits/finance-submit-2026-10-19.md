# Financial entry submission follow-up

Scope: `feature/premium-visual-preview`, based on `ce0324b`. Existing customer records are untouched.

The external report could open and fill the entry controls but did not observe a saved R$250 entry. A read-only database check confirmed no `financialEntries` in that professional profile. The report did not include a captured validation message, request payload or failed response, so the precise cause of that attempt remains unproven.

Previously, the entry controls were a section with a button that saved React state. They are now a native named form: button click and Enter submit the same handler, which captures the current named controls through FormData. This supports inputs populated by browser autofill or another mechanism without the expected React change event. Submitted values are copied into controlled state so failures retain them. Custom validation remains explicit and native constraint suppression cannot silently prevent submission. The existing cloud callback is still awaited before clearing fields or announcing success.

A synchronous ref lock prevents duplicate submissions while a request is pending. After success, the reference month changes to the entry's date, so saving a different month's entry cannot leave the user looking at an empty list for the old month. No money, payment or subscription is automatically fabricated.

The student's class package has an unspecified amount. The professional's contract-options adapter previously converted a blank amount into zero, causing a linked receipt to be rejected as exceeding a zero balance. Blank amounts now remain null and are labelled `Valor não informado`; an explicitly entered zero remains zero and retains its balance validation. The report does not establish whether a contract was selected in the failed attempt.

Verification: 66 Node tests pass. New component tests submit the native field snapshot with R$250 without prior React input updates, check the persisted adapter payload and displayed month, validate missing description, retain fields after rejected saves, retry successfully and reject a synchronous second submit while the first is pending. These are isolated component/adapter tests, not a claim of a new browser or real-account save.

External retest: use the new preview, same professional login, Financeiro → Novo lançamento. Select Recebimento, an explicit date, R$250, description `QA - recebimento auditoria`, Aluno Teste QA and **Sem contrato vinculado**. Its existing class package has no monetary amount, so it should not be used to imply a R$250 contract balance. Submit once, capture the inline success/error, verify the row and totals, reload and sign out/in. If it still fails, report all filled fields, exact inline error and whether a write request occurred; do not mark opening the form as a successful save.

No real browser replay was performed in this runtime. The external tester must confirm the actual save/reload. An unrelated local modification to an exercise video was preserved and excluded from this commit. No schema change, production deployment or `main` modification.
