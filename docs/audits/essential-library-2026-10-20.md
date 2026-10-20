# Essential library — 2026-10-20

User requested a smaller, practical exercise selection and videos for that selection.

- New prescriptions, dashboard suggestions and equivalents now use the existing 180 Portuguese essential exercises across 10 groups. The 876-item expanded catalog selector was removed.
- Added an accessible toggle to show only essential exercises with licensed video: 22 choices, including the two existing seated-row labels sharing one demonstration. There are 23 distinct media mappings overall; two are outside the essential selection.
- Retained the full underlying source metadata for already prescribed exercises, historical references, student execution and PDF generation. No Supabase writes, deleted exercises, workout changes, or migration were needed.
- Existing exact-name/source-ID matching remains in place; a video for a different grip or equipment is not substituted.
- Video acquisition queue: `docs/research/essential-library-video-plan.json`, regenerated with `node scripts/build-essential-video-plan.cjs`. Lists all 180 exact movements, source IDs and equipment when known, 22 available videos and 158 pending. Pending entries do not claim a license or invent a video.
- Workflow regression exercises the actual library component: no expanded selector, pagination, Portuguese search, equipment filter, illustrated selection, video-only filtering and restoration, and prescription edits. Full suite: `TZ=America/Sao_Paulo node --test tests/*.test.cjs` — 79 passed.
- No signed-in browser or physical Android validation claimed for this revision.

Branch: `feature/premium-visual-preview`. Preview only; production unchanged.
