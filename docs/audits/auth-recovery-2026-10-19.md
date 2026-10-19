# Email callback and password recovery follow-up

Scope: `feature/premium-visual-preview`, based on `b16f1b6a4d24d2e5a011cc5a13e22348aa2a75f2`. No database, existing account, production, billing or advertising changes.

## Corrections

- The recovery callback previously removed URL tokens and kept the password-reset screen only in React state. Reloading then restored the account instead of the password form. The existing tab-scoped session now retains a pending-reset flag, with server session validation before reopening the form. Token refresh preserves the flag.
- Successful password updates clear the flag and entered password, then sign out through the existing handler. Failed updates retain the pending state for retry.
- Expired/rejected email callbacks display a fixed Portuguese message, remove the callback fragment from browser history and do not render provider-controlled descriptions. Rejected session verification restores the previous session instead of retaining the unverified callback token.
- Signup and recovery continue redirecting to the current preview origin/path; no production URL is introduced.

## Verification

`node --test tests/*.test.cjs`: **57 passing, zero failing**. The expanded cloud test covers callback/reload, server validation, successful and failed password updates, expired links, invalid tokens, refresh during recovery, logout and the preview redirect URL. `git diff --check` passes.

These are isolated adapter tests, not proof of real email delivery. No messages were sent and no customer account was changed. A browser binary was not available in this runtime; no new browser or physical-device result is claimed.

Read-only checks of the existing Supabase project confirm email auth is enabled, signup is allowed and automatic email confirmation is disabled. Aggregated auth logs contain accepted signup/recovery requests and a verification redirect; these do **not** establish inbox receipt, SMTP configuration or correct redirect allowlisting. Those remain unverified.

## Remaining dependencies

- End-to-end email verification requires an authorized test mailbox, confirmation/recovery delivery, an allowlisted preview redirect and checking the resulting password login. The connected Supabase tools do not expose Auth SMTP/URL configuration. Do not disable confirmation or edit customer credentials to bypass this check.
- Physical Android testing remains pending. The browser preview is not a packaged Android app.
- Real purchases/ads still require provider configuration and Android integration already listed in `functional-preview-2026-10-19.md`; no payment or ad delivery is claimed.

References checked: Supabase password auth, OTP expiry troubleshooting and the current changelog. No schema migrations were reapplied.
