# Minimal workout read receipt

Branch: `feature/premium-visual-preview`, based on `f780d02`. No chat, message composer or conversation history is introduced.

- Completed workout feedback starts gray on both sides. Trainer sees `Recebido · Marcar como visto`; student sees `Enviado · Ainda não visto`.
- Trainer acknowledgement turns the check green: `Visto` / `Seu personal viu`. Student status appears in the completion summary, recent completed workouts and individual history cards.
- Replaces the congratulations composer and student encouragement cards in this preview. Existing congratulations data and compatibility endpoints are preserved, not deleted or repurposed as read receipts.
- Acknowledgement is explicit: opening the dashboard does not mark a workout read. Existing workouts remain unread until acknowledged.

## Storage and authorization

Additive migration adds nullable `pp_sessions_v2.feedback_seen_at` and a constraint restricting it to completed sessions. `public.pp_mark_feedback_seen(uuid)` is an invoker wrapper around a private definer function with an empty search path. It checks authentication, trainer role, ownership of the session's link and completion, sets server time once with `coalesce`, and returns the timestamp. Anonymous execution is revoked. Session table direct writes remain unavailable to clients; existing SELECT RLS supplies the receipt to the student and their trainer.

The receipt changes no logs, effort, note, revision, package balance or billing field. Repeated acknowledgements keep the same timestamp. No existing receipt is populated by migration.

## Refresh and failure behavior

Trainer stays gray until the server confirms; an error allows retry and concurrent double-clicks issue one call. Student polls only IDs of loaded completed sessions that remain unread every 15 seconds and refreshes on focus. The receipt-only request does not replace loaded workout history. A failed read keeps the prior status; it cannot fabricate green. Polling stops when nothing loaded remains unread or the screen unmounts.

## Executed verification

- `TZ=America/Sao_Paulo node --test tests/*.test.cjs`: **75/75 pass**.
- `tests/feedback-seen-database.sql` executed on the existing Supabase project inside a transaction ending in rollback. Passed: explicit unread default; owning trainer marks read; same timestamp on retry; student readback; student/unrelated trainer/anonymous denial; no direct client overwrite; unfinished workout rejection; unchanged feedback/session count/revision.
- Component/adapter tests verify gray/green labels, no message field, server acknowledgement before green, one pending write, failure/retry, malformed receipt-ID filtering and green propagation to the open student screen, including failed polling.
- Security advisor rechecked: no additional findings beyond the previously documented private-table notices and disabled leaked-password protection.

Migration file was created by the official pinned Supabase CLI. Its telemetry request was blocked by automatic review after local file creation; no further CLI invocation was used. The additive migration and verification were completed through the authorized Supabase connector.

No actual customer or existing QA workout was marked read by these checks. Database fixtures were rolled back. Main, production deployment and the unrelated local exercise video modification remain untouched. Signed-in browser/physical Android confirmation remains an external verification step.

## Browser retest

Use separate trainer/student sessions. Complete a QA workout with effort/note. Verify gray receipts. Trainer presses `Marcar feedback como visto`; verify green. Keep the student screen open for up to 15 seconds or refocus/reload it; verify `Seu personal viu` for that same workout. Reload both and verify persistence. Confirm no message input or congratulations composer appears in this flow.
