# Original demonstration video tempo — 2026-10-22

Branch: feature/premium-visual-preview. Preview only.

## Basis

ACSM, *Resistance Training for Health*, recommends controlled lifting/lowering, about two seconds each direction for a general demonstration. This is a reference tempo, not a replacement for the professional's individual prescription. Faster/power-focused training has different goals.

- ACSM document mirrored by UCSF: https://cardiacrehab.ucsf.edu/sites/g/files/tkssra13261/files/wysiwyg/resistance-training-for-health.pdf
- NASM goblet technique: https://www.nasm.org/resource-center/exercise-library/goblet-squat
- ACSM tempo review: https://digitalcommons.sacredheart.edu/pthms_exscifac/81/

## Editing

Both existing Personal Pro clips now contain two forward repetitions, four seconds per repetition, eight seconds total. No reverse playback; no artificial hold prescribed. Each clip retains its original framing and 640×640 resolution. Motion-compensated intermediate frames give 30 fps after slowing; H.264/yuv420p with faststart remains mobile-compatible. Audio remains absent; narration is a separate pending step.

Goblet: original 0.666667–2.791667 s, one top-to-top cycle, stretched to 4 s (~0.53× speed). Bench press: original 0.208333–2.958333 s stretched to 4 s (~0.69× speed). Repeat each cycle once. Posters refreshed to the new first frames.

Verification: ffprobe confirms 8.000 s, 240 frames, 30 fps, H.264, 640×640 for both assets. Contact sheets checked at intermediate poses and cycle boundaries. Slowing changes tempo, not the underlying AI-generated technique. Physical-device validation remains with the user.

No account records, prescriptions, database, main branch or production were changed.
