# Follow-up to the external functional audit

Scope: `feature/premium-visual-preview`, based on `09c2d1f82e86353d66d5f462c5bfcdd75b9ef2af`. Preview only.

## Prescription finding

The saved QA exercise had `name="4"`, `series="8"`, `repetitions="42.5"`, `load="90"`, `rest=0`, `sets="8x42.5"`. The active student session contained exactly the same object. This establishes that the observed mismatch existed before the student adapter: the database did not contain the intended 4/8/42.5/90 prescription. It does not establish which interaction shifted the inputs.

The exercise-name input was the first input in the edit dialog and lacked its own visible label. It now has a visible label and example, a separate prescription explanation and persistent inline errors. Saving a name made only of numbers is rejected while retaining the form. The validator also applies to custom exercise creation. No automatic reassignment or guessing of dosage is performed.

The workflow regression fills the five fields by their exact labels. It verifies rejection of `name="4"`, correction to Supino / 4 sets / 8 reps / 42.5 kg / 90 s and unchanged mapping through the student adapter. Subsequent editing retains the load history. All 60 Node tests pass.

## QA repair

Only **Aluno Teste QA** was repaired to the intended example in the external report: Supino reto com barra, 4 series, 8 repetitions, 42.5 kg, 90 seconds. The source identity was restored from the unchanged original test exercise. Existing assessment, hydration and load history were retained. No other student was changed.

The active QA session was repaired only after checking that it was unfinished, had no logged sets, had revision zero and still matched the erroneous prescription. Its revision was incremented, so a stale client cannot silently overwrite it. Reload both test sessions before retesting. This is a fixture repair, not a rule to rewrite active workouts when a professional updates a real prescription.

An authenticated password login followed by the real student-data RPC and session REST read confirmed matching objects: Supino / 4 / 8 / 42.5 kg / 90 s, revision one and no logged sets. The validation session was signed out. A PDF generated locally from that exact RPC result was extracted with `pdftotext`: its row contains Supino, 4, 8, 42.5 kg and 90 s. This verifies PDF generation/content, not a browser download/open action.

## Completion, feedback and privacy

A transaction with rollback exercised the repaired QA session under authenticated student/trainer roles: student projection, four logged sets, completion, effort and note, professional visibility, congratulations and student receipt. The professional's read of the student's nutrition entries was denied by RLS. No completion, encouragement or extra set from this check remains in the account.

The existing professional UI shows **Hoje → Treinos concluídos → Parabenizar** after a linked student completes a session. An unfinished workout does not produce that action. A privacy notice or absent navigation tab alone is not evidence of server authorization; distinguish UI checks from the RLS checks above.

## Verification limits

- Browser regression `tests/browser/workout-delivery.cjs` now includes name validation and edit/save/reload with the audit's exact values. Syntax checked; **not rerun in this runtime**, whose browser download failed. Node handler/adapter tests and real database tests are separate evidence.
- No new physical Android test or browser download/open-PDF result is claimed.
- The rest of the external report's unexecuted scenarios remain pending; navigation alone does not establish financial calculations, file download or privacy enforcement.
- No production deployment, `main` change, schema change or payment simulation.
