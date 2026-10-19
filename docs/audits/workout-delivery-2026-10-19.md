# Workout library, prescription and appointment follow-up

Branch: `feature/premium-visual-preview`. Preview only; no existing customer accounts or schema changes.

## Findings and changes

- After adding an exercise, `_d` closed the library and immediately reopened it with `va(true)`. Removed the reopen. Returning from the workout hides the panel while preserving its unfinished prescription; reopening the library explicitly resumes it. Closing the student record or navigating the main tabs clears the panel.
- A populated library prescription must be added to the student's sheet before “Salvar treino” can report success. Attempting to save the workout with an unadded prescription brings the form back with guidance. Blank prescriptions remain explicitly “A definir”; no dosage or load is invented.
- Added “Salvar horários” to the existing appointment configuration. It validates the package and all active slots, awaits the account adapter's server acknowledgement, reports errors inline and opens the next scheduled date. Existing autosave remains. Confirmation clears when configuration changes.
- Assessment updates now carry `measureDates`, `measureHistory` and `weightRecords` through the same account updater, preserving the history produced by the assessment component.
- PDF review and the final generate/download actions are intentional. No messages are sent automatically.

## Evidence

- 57 automated tests pass. Updated workflow assertions cover closing after adding and retaining an unfinished prescription without automatically reopening the panel.
- `tests/browser/workout-delivery.cjs` passes in Chromium at 320×568, 390×844 and 1440×900 using an isolated REST adapter: select Supino → prescribe 4 sets, 8–12 reps, 22.5 kg, 90 s → add → library closes → save → reload → values unchanged → actual PDF download → configure a 12-class package and a weekly slot → confirm → reload → appointment present.
- The same browser flow passed at 390×600 against the real existing Supabase project using a disposable QA account. SQL independently confirmed series `4`, repetitions `8–12`, load `22,5 kg`, rest `90` and appointment time `18:00`.
- Extracted text from the downloaded PDF contains the exercise and every prescribed value. The downloaded bytes start with `%PDF-`.
- The disposable QA account is signed out and removed after the deployed preview check. No customer test data is deleted.

This test did not reproduce a loss of dosage in an already-added exercise. It verifies the complete add/save/reload/PDF path and prevents a populated but unadded form from being confused with a saved prescription.

Run with the same Playwright/Chromium environment variables documented in `save-flows-2026-10-19.md`. For a real disposable account, seed a student named `QA Workout` with an empty workout before executing the browser test. No customer credentials belong in the test or repository.
