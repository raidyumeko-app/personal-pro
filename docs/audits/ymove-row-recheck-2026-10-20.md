# YMove list recheck — 2026-10-20

Rechecked the user's new source list against the 44 missing demonstrations. The list names YMove, free-exercise-db-api and the existing image database; these are already represented in the project. Found one omitted match in YMove's current public free pack: Single Arm Dumbbell Row - Legs apart.

Downloaded the official MP4 (1,074,064 bytes), decoded it, and inspected frames at 0, 2 and 4 seconds. It shows a standing one-arm dumbbell row with the free hand supported on the thigh. Added the exact identity `One-Arm_Dumbbell_Row`, preserving the existing exercise and prescription. Execution explicitly identifies the standing/thigh-support demonstration variant rather than silently presenting it as a bench-supported clip.

Coverage: 130 selected choices, 87 with a demonstration and 43 without. The catalog was not expanded. Existing media keeps priority; no Supabase writes, saved-workout changes, main update or production deployment.

Validation: existing 83 tests pass, including updated coverage, source mapping, variant metadata, video filtering, execution failure fallback and prescription preservation. Actual provider clip downloaded/decoded; signed-in browser and physical Android remain external checks.
