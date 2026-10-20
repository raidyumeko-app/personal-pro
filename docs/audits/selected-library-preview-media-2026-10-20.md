# User-selected exercise library and demonstration source — 2026-10-20

## Scope

The user explicitly authorized the supplied `luisaraujoc/free-exercise-db-api` source for preview testing and required the supplied exercise list to replace the broader selection.

- The list has 136 entries; six repeated labels were consolidated into 130 choices. The exact rows and merged labels are recorded in `docs/research/selected-library.json`.
- Both `exercise-library.json` and the inline choice list now contain only those 130 entries. The previous 180 list and 876 expanded list are not offered. Search includes former Portuguese labels as aliases. Examples also use the selected movements.
- The source archives are compatibility data only. `exercise-compatibility.js` fetches them only when a saved prescription references an absent source ID, and appends only the referenced rows to execution/PDF metadata. Archive rows never enter the selectable library or equivalent suggestions. No customer data, saved prescription, or Supabase state was changed.

## Video evidence

Source dataset pinned at commit `38c5670c3210f69268a0255bdb2cb3edcb596c46` in https://github.com/luisaraujoc/free-exercise-db-api . The dataset was downloaded and matched manually; source scripts were not executed.

- Downloaded available male/female files for 91 candidate identities, decoded with ffprobe (H.264, positive duration), and inspected default-variant contact sheets extracted from the actual MP4 files. Source clips are anatomical animations, not live model filming.
- Rejected eleven candidate identities: different equipment/posture, insufficient correspondence, or video/content disagreement. Examples: a clip called Glute Bridge actually shows a plank; Standing Adductor Stretch shows a lying leg raise. Exact rejection reasons are recorded in the selected manifest. Other compatible existing demonstrations retain priority.
- 81 preview mappings cover 86 unique choices when combined with existing licensed demonstrations. Only the 130 selected options appear in the library. 44 have no accepted video. Multiple labels may refer to the same source clip; 86 is exercise coverage, not the number of newly filmed or unique clips.
- Original male/female URLs are retained, with a variant selector in the execution view when both exist. Source MP4 URLs are used directly in the preview; downloaded review copies are temporary and were not committed or uploaded to Supabase.
- Playback delivery checked in the cloud browser for the actual `dumbbell-fly.mp4`: readyState 4, 1920×1080, no media error, playback time 6.573233 s. This is a public-source playback check, not a signed-in student session or Android device check.

## Preview boundary

The new source is explicitly `licensed: false`, `previewOnly: true`. It is enabled only on localhost and this project's nine-character Vercel preview deployment hostnames. It is disabled on production/custom domains and similarly named hostile domains. Existing licensed media remains available independently. No generic media-rights gate in the pure session engine was weakened.

## Validation

`TZ=America/Sao_Paulo node --test tests/*.test.cjs`

Tests cover the exact selection, aliases, source removal, translated metadata, search/filter/pagination, 86-choice preview video filter, preview-only domain guard, rejected mismatches, male/female switching with retry, compatibility references and failed archive fetch, existing PDF/portal/workout flows. No signed-in browser audit or physical Android pass is claimed.

Branch only: `feature/premium-visual-preview`. Preview deployment only; no main/production release.
