# Authorized YMove free video integration

Branch: `feature/premium-visual-preview`, based on `bb42131`. Scope is additional exercise demonstration media; prescriptions, user records, billing and workout execution state remain unchanged.

## Source and permission

Checked https://ymove.app/free-exercise-videos on 2026-10-20. The publisher offers 25 free 720p MP4 clips and expressly permits commercial use inside apps, websites and client materials. Attribution is optional. Standalone resale or redistribution as a video library is prohibited. Only the free pack is used; no paid API, account, key or subscription was created.

`docs/research/ymove-free-media-manifest.json` records each integrated exercise identity, reviewed provider clip, original/thumbnail URL, SHA-256, duration and byte count. The app credits YMove and links its source/permission page. This manifest and media mappings are part of the app integration, not a downloadable standalone video library. Review copies stayed outside the repository.

## Integration

- Added 15 exact movement/equipment matches to the shared resolver. The existing eight local licensed demonstrations remain selected for their exercises, giving 23 mapped video identities in total.
- English catalog IDs and explicit Portuguese aliases resolve the same media for professional preview and student execution.
- Prescribed source identity now takes precedence over a conflicting display name; fallback name matching remains available for existing manually named exercises.
- No exercise catalog was replaced, translated, duplicated or removed. Prescribed sets, repetitions, load and rest remain unchanged.
- New videos use official public YMove free endpoints, with matching official thumbnails. Existing inline controls and failure fallback are reused. This delivery needs internet and depends on publisher endpoint availability; no offline-media claim is made.

## Verification

- Downloaded all 25 clips into temporary local review storage. `ffprobe` identified all as valid H.264, 720×1280, with nonzero duration. Inspected sampled frames across the clips to distinguish equipment, grip and support variants before assigning matches.
- Official video endpoint accepted a Range request: HTTP 206, `video/mp4`, bytes 0–1023, public cache max-age 86400. Thumbnail endpoint returned HTTP 200 with `image/jpeg`.
- Cloud browser: selected `Leg Extension` on the official publisher page. It loaded `https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c` and played with `readyState=4`, `paused=false`, `currentTime=4.629439`, dimensions 720×1280 and no media error. Initial loading briefly displayed an unavailable-media accessibility placeholder; the subsequent actual playback check succeeded. This is a provider playback check, not a claim of a signed-in app/Android test.
- Four regression tests cover the 15 additions, the retained eight local clips, unchanged prescription fields, source-ID precedence, exclusion of incompatible variants and continued set recording with image fallback after a video error.
- Full suite: `TZ=America/Sao_Paulo node --test tests/*.test.cjs` — **79/79 pass**.

No database mutation, main-branch change or production deployment. Preserve the unrelated local change to `media/exercises/371.mp4`; it is excluded from this commit.

## Preview retest

In a QA prescription, add `Cadeira extensora`, `Mesa flexora`, `Rosca martelo` or `Levantamento terra com barra`. Open execution and play the clip; confirm title, movement and saved prescription. Repeat on the linked student. Exercise controls and completion should remain usable if media cannot load. Physical Android playback remains to be confirmed externally.
