# Student trial and external QA access

Scope: `feature/premium-visual-preview`. Latest owner instruction supersedes permanently free student workouts and the optional nutrition-only/evolution upgrade.

- Student: all student areas for 30 days from server-controlled `pp_members.created_at`; afterward R$9.90/month for the single existing student product. No ad-supported student tier.
- Professional: existing 30-day trial, R$29.90/month or free with ads remains unchanged.
- The server RPC `pp_student_access` returns status, deadline and server time. Workout projection/start/save and session/nutrition/storage policies enforce access. No client can restart the trial or grant an entitlement. Existing profiles, links and history are preserved after expiry.
- The student screen checks the server before loading workouts, rechecks on focus/deadline and shows a subscription gate after expiration. Nutrition and advanced evolution are available during the trial. Purchase actions remain explicitly unavailable until real provider integration is configured.

## Account explicitly authorized by the owner

Created **Aluno Teste QA**, linked to **Wagner Teste / WssFit**. This is a clearly identified test account with a new 30-day trial, not a paid entitlement. Its one example exercise was copied from the existing test prescription. No invented financial payment or real measurement was recorded. The preexisting student and professional profile were retained. Credentials are provided directly to the owner and are not in this repository. This account remains available for the external tester.

## Verification

- 60 Node tests pass, including the student gate, no workout fetch while blocked, deadline revalidation and failure to validate access.
- `tests/student-trial-database.sql` passes in a rollback transaction: final trial second allowed, exact 30-day deadline blocked, direct RPC/REST read/write restrictions, inability to reset trial, preserved history, professional ads choice and nutrition privacy. No payment is simulated or persisted by this test.
- Existing `tests/portal-database.sql` passes after updating the nutrition expectation for the full trial: invitations, isolation, prescription projection, sessions, concurrent revisions, completion, effort and congratulations.
- Real password login succeeds for the new QA account. Authenticated RPC confirms student role, trial expiry, WssFit linkage and one exercise. REST returns zero professional account rows; private coach notes/finance are absent from the projection. Validation session signed out afterward.
- Supabase security advisor shows the preexisting leaked-password warning and deliberate no-client-policy private tables; no new security finding was introduced.
- Physical Android, email inbox delivery and real billing/ads remain unverified. No production deployment or `main` change.

## External tester flow

Open the delivered preview in a private/incognito window (or sign out of the professional session) and use the supplied student credentials. Confirm Hoje, exercise execution, sets/load/rest, reload/resume, completion/effort, Histórico, Evolução and Nutrição. From the existing professional login, use the separate **Aluno Teste QA** sheet to edit prescription/measurements and send congratulations; confirm those changes from the student login. Do not modify Ana Costa Teste or the professional's own profile to test this account. Real purchases, recovery email delivery and background Android notifications remain external dependencies.
