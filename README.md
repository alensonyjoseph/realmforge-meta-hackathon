# REALMFORGE — One photograph. An impossible world.

Meta Global AI Developer Hackathon 2026 · Indie Developer · Source created during the hackathon.

The application transforms a user's actual tabletop photo into an original interactive magical world. Meta Muse Spark 1.3 uses multimodal image understanding and structured output to identify ordinary objects with approximate bounding boxes, invent an imaginative scene graph and generate a playable three-step puzzle. Muse Image 1.0 edits the original photo to make a photorealistic fantasy scene that preserves the source layout where possible. The puzzle engine renders clickable hotspots and validates actions deterministically.

This is a photo-grounded interactive world, not tracked 3D AR. Dynamic generated imagery requires live Meta API calls. The app deliberately does not fake those outputs when the model is unavailable.

## Setup

Deploy to Vercel with Node.js serverless functions. Set MODEL_API_KEY as a sensitive production environment secret. Set DEMO_ACCESS_CODE to a long unpredictable access phrase to restrict billable generation calls. Never commit either value. Open the deployed website, enter the demo code, upload a clear scene with at least 3 distinct objects, and press Awaken. Production demo must be tested against real model responses.

## Safety / billing

Model calls are server-side only and protected by access-code comparison, size validation, input limitations and request timeouts. The Meta dashboard supports spend alerts, not hard spending caps. Any public launch should implement authentication plus durable per-user and account quotas; the shared demonstration-code gate is intended only for short, private hackathon judging access. Obtain the photo owner's consent before uploading. Images are sent to Meta only when the user requests the transformation.

## Files

- index.html: original responsive frontend design.
- app.js: image input, before/after reveal, interactive grounded objects, state machine.
- api/analyze.js: Muse Spark multimodal scene graph and puzzle generation.
- api/transform.js: Muse Image photorealistic image editing.
- api/status.js: readiness metadata only.
- lib/meta.js: authorization, image bounds, timeout, server-side API.

## Current limitations

- New concept; visual fidelity and correctness depend on real Meta API responses, not yet verified until billing/key.
- Muse Spark approximate object bounding boxes may be wrong; can later use SAM 3.1 masks for precise hot-spot locations.
- Does not produce real spatially tracked native AR or mesh animation.
- Browser built-in speech commands are not Meta Muse Voice Transcribe; that would require a separate integration.
- No public GitHub repository, formal demonstration video or judged submission until separately completed.
- No claim of success in the hackathon or completed external validation.
