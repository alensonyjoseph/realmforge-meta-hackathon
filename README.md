# REALMFORGE LIVE
### Reality is the controller.

**2026 Meta Global AI Developer Hackathon · Indie Developer**

[Open the live app](https://realmforge-meta-worlds.vercel.app/) · [Source repository](https://github.com/alensonyjoseph/realmforge-meta-hackathon)

**Point your camera at ordinary objects. Meta AI turns them into a cinematic fantasy realm. Move the real objects, and the realm reacts—only when the movement can be independently verified.**

REALMFORGE LIVE is a mobile-first experiment in **physically grounded generative play**. Instead of using a photo to generate an unrelated image, it makes a user’s actual surroundings part of the game.

## The 60-second experience

1. Place a cup, book and keys on a tabletop with enough space between them. Open **Live Camera**; alternatively choose **Photo** or upload a **short Video**.
2. Capture the initial real-world scene and select an original fantasy theme.
3. Press **Awaken Reality**. Meta **Muse Spark 1.3** grounds named objects in image coordinates and generates a scene/quest. **Muse Image 1.0** reimagines that same photo as a fantasy keyframe.
4. REALMFORGE selects a safe, movable object and a distinct target—e.g. move the keys beside the book. The **actual physical objects** are the control surface.
5. Physically move the object. With camera still open, press **Verify Physical Move**; with Photo mode, supply a second photo; with Video mode, the app extracts first/last frames locally.
6. Muse Spark observes both photographs; the independent **fail-closed geometry verifier** evaluates object visibility, object identity, camera stability, scale, relative displacement and final proximity. It can output **SUCCESS / NOT_YET / NO_CHANGE / UNCERTAIN**. The model alone cannot authorise a game transition.
7. On verified success, local cinematic effects activate. Muse Image creates a **new post-action magical keyframe** grounded in the updated real photograph.

The photographic keyframes and live overlays are **not continuous photorealistic video synthesis**. The live camera remains real camera footage; particles and visual tracking render locally in the browser. There is no claim of full tracked 3D AR/SLAM or persistent 3D mesh generation.

## Three user modes

| Mode | Input | Physical-action verification |
| --- | --- | --- |
| **Live Camera** | Web camera stream, captured starting frame | Capture a new frame after physically moving an object |
| **Photo** | Initial JPG, PNG or WebP | Supply a separate after-photo |
| **Video** | A 2–35 second local video | Extract and compare frames near start/end, **without uploading the whole video** |

The local visual-only tracker in \`tracker.js\` helps animated highlights follow image features across camera frames. It does **not** decide whether a physical action happened. Only the server-side independent verifier can authorise the in-game spell.

## Real Meta technology, not just during development

| Model/system | Contribution |
| --- | --- |
| **Muse Spark 1.3** | Vision-grounded object identities, normalized boxes, original realm/quest generation; before/after physical scene observation |
| **Muse Image 1.0** | Two creative keyframes: initial and post-verified-action photo edits |
| **SAM 3.1** | Optional text-prompt segmentation to refine up to 3 object locations |
| **Independent engine** | Exact physical movement and camera-stability qualifications; rejects insufficient evidence |
| **Local browser** | Camera, image/video extraction, image-comparison UI, particle animation, camera feature tracker, Web Audio |

## Repository map

\`\`\`
index.html                  # LIVE entry point, mobile-first design
live.css / live.js          # App UI, camera/photo/video, physical quest flow
effects.js / tracker.js     # Local animated magic and visual-only tracking
api/analyze.js              # Muse Spark multimodal object + quest generation
api/verify.js               # Muse Spark observes the original before/after scenes
api/transform.js            # Muse Image: original and post-action fantasy keyframes
api/segment.js              # Optional SAM 3.1 segmentation
api/act.js                  # Legacy constrained spoken command interpreter
lib/geometry.js             # Deterministic, fail-closed physical verifier
lib/quest.js                # Select a plausible safe movable object and target
lib/meta.js                 # Secret protection, input validation, timeouts
classic.html / app.js       # Preserved earlier image-click experience
test/physical.test.mjs      # Actual deterministic verification tests, mocked observation
test/unit.test.mjs          # Model contract and input validation tests
.github/workflows/verify.yml # GitHub CI syntax + all 13 automated tests
\`\`\`

## Engineering decisions

**False success prevention.** The model’s JSON observations are treated as fallible measurements. It never directly declares whether the player succeeded; the deterministic verifier does so using normalized object bounding boxes and camera-consistency constraints.

**Object selection.** The quest generator selects a familiar movable item, a separate nearby-able target, and a stationary reference when available. It refuses to invent a physical mission when the captured scene does not provide suitable distinct objects.

**Automatic cost protection.** The app only calls Meta when the user clicks an explicit action: initial Awakening, physical Verification, optional SAM refinement and a second image generation **only after a verified win**. Browser-side session limit: 12 model requests. The deployment additionally requires a long private access code; server-side secrets are not sent to clients. **Important:** a shared demo access code and browser-side limit are not a durable account-level quota, and Meta spending alerts are not hard spending caps. Never make this a general public paid-service launch without production authentication and persistent quotas.

**Data minimization.** Camera preview and input video stay local. A resized image is sent to Meta only after explicit user-initiated operations. Browser storage contains the demo access code for convenience (per session), not the photos. The application does not intentionally persist images on its own servers.

## Run and verify

- Use Node 20+ with Vercel. In Vercel production secret settings configure \`MODEL_API_KEY\` and \`DEMO_ACCESS_CODE\`.
- \`npm run check\` checks application syntax and deterministic tests.
- \`node --test test/*.test.mjs\` runs test cases without spending model credits.
- Open \`https://realmforge-meta-worlds.vercel.app/\` and run the full photo-to-physical-action workflow with your **actual** desk scene.
- A real mobile camera and visible physical object motion are required for final end-to-end evidence. Mocked unit tests are not proof of real model recognition.
- Share reviewer/demo access code **privately**, not in public GitHub or README.

## Verification record

- ✅ Deployed responsive application, mobile and desktop browser checks.
- ✅ 13 deterministic model-contract and physical-verification tests passed.
- ✅ Public source repository and GitHub Actions workflow verified.
- ✅ Real Meta Muse Image + scene generation was demonstrated in the previous REALMFORGE prototype using a cup photograph.
- ⏳ **The new live physical movement loop has not yet been independently demonstrated with two genuine photos and a successful production verifier result.** Do not claim it has until the live test passes.
- ⏳ A genuine, accessible three-minute demo video and the final competition submission are separate requirements.

The product concept and all visuals are original fantasy work. No film franchise characters or unrelated proprietary project source is included. **This README describes implemented functions and notes which evidence is still unverified.**
