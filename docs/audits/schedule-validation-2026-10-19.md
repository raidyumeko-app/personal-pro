# External audit: incomplete schedule configuration

Scope: `feature/premium-visual-preview`, based on `594ec74`. No database or customer-record changes.

The QA package has eight classes and two active slots. Both stored `time` values are empty; durations are 60 minutes and weekdays are Monday/Tuesday. The first location is QA Academia. Selecting the weekday alone does not provide the required start time, so rejecting confirmation is correct. No loss of a populated time was established by this report.

The previous generic error did not identify the missing fields. The configuration now numbers each fieldset and names each invalid appointment/day/field in its inline hints and save error. It distinguishes absent start time, missing weekday, invalid duration and ending after midnight. Incomplete rows are preserved; no time is guessed or row deleted. An empty/null weekday can no longer be coerced to Sunday by numeric conversion.

Verification: 62 Node tests pass. New regressions cover the actual two-empty-slot shape, correcting one row while the other remains invalid, two valid rows, duration/end-of-day errors, blank weekdays and retired slots. No new browser or physical-device test is claimed.

For external retest: open Aluno Teste QA → Atendimentos → Contratação. In each numbered Atendimento fieldset, explicitly set its day, start time and duration, then save. To keep only one recurring appointment, retire the extra row explicitly. Confirm the next date, reload and check the agenda. The preexisting package, two draft slots, workouts, assessments, nutrition and completion records were not altered by this follow-up.

Other audit gaps (financial entries, real diet-PDF import, meal editing/deletion, advanced evolution, failure modes, physical Android) remain separate. A visible privacy notice is UI evidence only; server isolation requires an authorization test. No production deployment or `main` changes.
