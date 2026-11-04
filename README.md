# REALMFORGE — One photograph. An impossible world.

**Meta Global AI Developer Hackathon 2026 · Indie Developer · Build for Your World**

[Live application](https://realmforge-meta-worlds.vercel.app/) · Original code and development history in this public repository.

REALMFORGE aims to turn an ordinary tabletop photo into an original, playable fantasy quest. It uses **Meta Muse Spark 1.3** for multimodal understanding, a structured object scene graph, game objectives and natural-language action interpretation; **Muse Image 1.0** reimagines the exact photo as a cinematic magical realm; and an **optional SAM 3.1** step attempts to refine up to three real-object locations using segmentation. A deterministic browser game engine handles object selection, quest transitions and win conditions. Models propose; deterministic code validates progression.

This is a **photo-grounded interactive image** experience. It is not 3D mesh generation, markerless tracked AR, ARCore or ARKit. No franchise or copyrighted character designs are used.

## The core demonstration

1. Upload a real desk/table photograph containing at least three distinct objects.
2. Pick an original fantasy setting and click **Awaken this world**.
3. Muse Spark identifies visible objects and creates an original three-step quest represented as structured JSON. Muse Image performs input-grounded fantasy image editing.
4. Compare the original photograph and generated artwork with the reveal slider. Click the object hotspots to progress through the quest. Invalid actions cannot advance the state machine.
5. Optionally click **Refine targets with SAM 3.1** to request live segmentation and improve target locations. This is separate from the initial generation to reduce cost.
6. Type or speak an action. Simple object names are matched deterministically; more complex text uses a constrained Muse Spark action interpreter.

## Technology and traceability

| Feature | Implementation |
|---|---|
| Multimodal scene understanding | api/analyze.js → muse-spark-1.3 |
| Grounded fantasy image editing | api/transform.js → muse-image-1.0 |
| Spatial segmentation refinement | api/segment.js → sam-3.1 (optional, live output not yet validated) |
| Natural-language action interpretation | api/act.js → muse-spark-1.3 |
| Deterministic game rules | app.js |
| Private model-key handling, request bounds | lib/meta.js |
| Interface | index.html + app.js; Chrome/mobile responsive |
| CI | .github/workflows/verify.yml — five tests with mocked model output |

**Important verification boundary:** the CI tests do not invoke live Meta models. Actual image generation and SAM output must be tested independently before presenting them as working competition results. One initial live Muse Spark test yielded empty output; a subsequent token-budget adjustment is deployed but not yet confirmed live.

## Local development and deployment

This project requires Node.js 20+ for serverless development. For Vercel deployment, set the environment variables **MODEL_API_KEY** and **DEMO_ACCESS_CODE** as protected server-side secrets. Never commit real credentials, an access code, user photos, or production billing details. Run `npm run check` for syntax; `node --test test/unit.test.mjs` for the deterministic mock API tests.

The deployed experience deliberately refuses Meta generation until secrets are configured. Real user uploads go to Meta only when the user explicitly requests generation. Voice input uses the browser's native speech API, **not Muse Voice Transcribe**.

## Responsible demonstration and costs

The hackathon participant guide requires the public repo, public live product, authentic **three-minute demonstration**, and clear attribution of newly built work. The model endpoints use a strong shared demonstration code, size limits and server-side access checks; this is a temporary protection, **not a hard spending limit**. Meta's spending alerts do not prevent charges. A production release requires account-based authentication and persistent quotas.

The public web application is not equivalent to unrestricted access to billable model endpoints. Reviewers need a private demo code, or a verified cached walkthrough and a request for authorised live access.

## Current status (November 4, 2026)

- [x] New public GitHub repository and Git history.
- [x] Working responsive interface deployed to Vercel.
- [x] Basic browser smoke tests on desktop and mobile.
- [x] Meta Model API secrets configured on production.
- [x] Five CI tests passed using mocked model responses.
- [ ] Successful live photo → Muse Spark scene graph → Muse Image editing test.
- [ ] Successful optional live SAM 3.1 segmentation test.
- [ ] Verify generated spatial targets against an actual photograph.
- [ ] Capture and publish an authentic ≤3-minute demo video.
- [ ] Confirm reviewer access to live Meta generation.
- [ ] Submit project through Cerebral Valley by 9 PM ET November 4.

All submitted claims should distinguish verified implementation from planned or unverified capability. The game does not include code or confidential intellectual property from any unrelated projects.
