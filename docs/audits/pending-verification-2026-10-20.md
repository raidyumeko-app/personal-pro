# Pending verification — 2026-10-20

Scope: `feature/premium-visual-preview`, based on `8aa9342`. No production release, schema migration, real payment, subscription change or change to existing QA/customer records. Preserve the unrelated local modification to `media/exercises/371.mp4`; it is excluded from this change.

## Server verification

Executed `tests/student-trial-database.sql` and `tests/portal-database.sql` on the existing Supabase project `lnlwkjsfcpeofhajqesh`. Each execution used isolated identities and a transaction ending in `ROLLBACK`.

- Last trial second grants access; the exact 30-day boundary denies student projection, session creation/save and nutrition reads/writes.
- Client cannot reset trial creation time. Expired student data remains stored. The trainer retains their ads option and student workout history.
- Student cannot read trainer account/private notes/financial fields; another student cannot read the first student's sessions or reuse an invitation.
- Trainer cannot read student nutrition or private storage metadata. Storage rejects writes to another owner's folder. Expired student cannot read private file metadata.
- Current and historical body measures, including per-region dates, are present in the permitted student projection.
- No temporary members remained after rollback. The bucket is private, limited to 10 MB, and permits JPEG/PNG/WebP/PDF.

Storage SQL fixtures test metadata authorization only; they do not prove a binary upload/download. No existing file was changed.

Security advisor: only existing informational findings for intentionally private RLS tables without direct policies, plus disabled leaked-password protection. No settings were changed. Reference: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .

## Corrections

1. Reproduced two immediate nutrition form submissions issuing two writes before a React render. A synchronous operation ref now rejects the second pending operation. Meal retry retains its UUID, timestamp and uploaded photo path, so a committed request whose response was lost can be retried through the existing upsert without adding a duplicate. Failed saves keep inputs and do not announce success.
2. The bundled modern PDF.js required `Uint8Array.toHex`, which failed in Node 24 and is unavailable in some older browsers. Switched **both** main and worker to the official matching legacy minified build of the same pinned version, 6.4.299. Verified npm package integrity and recorded file SHA-256 values. No hand-written global polyfills. Mozilla documents legacy compatibility here: https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#which-browsersenvironments-are-supported .

## Verification executed

`TZ=America/Sao_Paulo node --test tests/*.test.cjs`: **70/70 pass**. The existing fixed-date schedule tests assume a timezone in which their fixture instant falls on October 15; the host defaults to Asia/Kuala_Lumpur. The initial default-zone run failed two calendar tests; the product-zone run passed without changing their assertions or the scheduling implementation.

`node --experimental-vm-modules tests/nutrition-files.integration.cjs`: **pass**, using the runtime's `@napi-rs/canvas` for image/canvas primitives.

- Actual text PDF yields exactly 07:00 and 12:00 meals, 100 g / 150 g / 80 g substitution, and preserves the QA observation.
- Actual image-only PDF yields no meals and `scanned=true`, requiring manual organization; no invented portions.
- Invalid MIME and oversized PDF rejected. Actual JPEG recompression produces a nonempty JPEG with maximum dimension 1280.
- File selection produces an editable review without activating a plan. Explicit confirmation writes reviewed meals and the original PDF path; a new panel restores the saved plan via the data adapter.
- File adapter preserves MIME and owner-prefixed paths; another owner's signed-file request is rejected before an HTTP call.
- Two dated body assessments preserve prior values and per-region dates; silhouette renderer receives both and renders the correct -1 cm waist comparison and +0.5 cm arm comparison.
- Meal double submission, offline error/input retention/retry and response-loss idempotency pass, alongside existing trainer cloud draft recovery and workout session conflict tests.

The integration harness uses real PDF/image bytes and the actual parser/components, but **mocked HTTP persistence**. PDF.js warns about missing optional standard font assets in the fixtures; expected text was extracted exactly. This is not a claim of a browser upload or an Android physical-device test.

## External audit reconciliation

The Grok double-click report was corrected: weights 75.5, 76 and 76.2 are three distinct records, not a duplicate. The nutrition submission issue above is a separate reproduced case. External browser verification already confirmed finance creation/edit/export, workout delivery/PDF/conclusion/congratulations and appointment presence/cancel/reschedule persistence. Package total 180 and remaining 179 were preserved; its change from the original 8 remains unexplained.

## Remaining physical/browser checks

- Android physical: keyboard, normal time input, navigation, scrolling, dialogs and video.
- PDF text/scanned and meal-photo selection/upload/open original through the signed-in interface; full storage HTTP roundtrip.
- Browser network interruption mid-save and reconnect, in addition to the executed isolated failure tests.
- Manual absence registration and optional package deduction. The isolated schedule tests already cover absence/cancel/refund and no future attendance.
- Real email confirmation/recovery delivery; final payment/ads integrations; Play Store last.

The preview login page was accessible in the cloud browser. This browser requires secure user credential entry for a signed-in UI session, so no automated credential injection or signed-in browser pass is claimed. Existing accounts, real subscription dates and production remain untouched.
