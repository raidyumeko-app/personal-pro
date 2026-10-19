# Student registration and monthly ledger persistence

Scope: `feature/premium-visual-preview`, preview only. No schema, policy, existing user data, production, billing or Play Store changes.

## Findings

At 390×600 the original inline registration button sat at y=530–574, under fixed bottom controls. A physical coordinate hit at its center reached the temporary “Alunos listados” toast; the toast also used z-index 100 and intercepted clicks. The navigation beneath it can route to Biblioteca. A locator click that auto-scrolls masked the overlap. At 390×844 the original creation handler and REST adapter saved correctly with an isolated response adapter.

The ledger used `Number(amount)` on a number input and did not support Brazilian `1.234,56` input. Both flows previously reported success/cleared fields before the asynchronous cloud write completed; financial validation and errors depended on a short-lived toast.

## Fix

- Student creation is an accessible, scrollable dialog above navigation, with labelled fields, keyboard submit, disabled controls while saving and visible inline errors.
- Creation waits for the real Supabase acknowledgement before closing the dialog/updating the list; failures retain entered data. Pending local recovery must be reviewed before overwriting it.
- Ledger creation/editing awaits its cloud save callback before clearing fields, with persistent success/error feedback. Brazilian decimal and grouped-thousands input is parsed conservatively into numeric centavos.
- Toasts no longer intercept clicks and sit above bottom navigation. Focus scrolling reserves bottom space.
- Existing student fields, accounts JSON, RLS and other feature handlers remain in use.

## Verification

- `node --test tests/*.test.cjs`: 57 passing, zero failing, including BRL parser cases.
- `tests/browser/save-flows.cjs` (Chromium 153): 320×568, 390×844 and 1440×900 using an isolated REST adapter. Physical hit testing confirms the Save control receives the click. Both flows retain fields after HTTP 503, retry successfully without duplicates and survive reload.
- Same browser flow with a disposable account against the real existing Supabase project at 390×600: login → student registration with R$120,50 → reload → ledger R$1.234,56 → reload → logout → fresh login → both records present. QA sessions signed out.
- SQL independently confirmed one QA student (`planValue=120.5`) and one QA ledger entry (`amount=1234.56`). No existing account was modified by the tests.

The disposable QA identity/data are removed after deployed-preview verification. Real customer credentials are not stored in the test or repository. Play Store, purchases and ads remain outside this correction.

To reproduce: install Playwright/Chromium in the test runtime, provide `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH`, then run `node tests/browser/save-flows.cjs`. For real persistence use **only** a disposable account via `PP_REAL_EMAIL`/`PP_REAL_PASSWORD`; `PP_BASE_URL` optionally selects the shared preview. Proxy-enabled environments can set `PP_BROWSER_PROXY=1` with `HTTPS_PROXY` configured.
