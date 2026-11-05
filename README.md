# REALMFORGE LIVE

## Reality is the controller.

**Meta Global AI Developer Hackathon 2026 · Indie Developer · Build for Your World**

[**Watch the 2:55 demo**](./demo.mp4) · [**Try the live app**](https://realmforge-meta-worlds.vercel.app/) · [**Technical evidence**](./DEMO_EVIDENCE.md)

**What if a cup, a book and a phone could become the controls for a fantasy game that has never existed before?**

REALMFORGE LIVE is an original, browser-based experiment in physically grounded generative play. It uses Meta's visual models to discover ordinary objects, transform the same photograph into cinematic fantasy art, and turn those objects into a physical quest. The surroundings aren't just a background image: they're the game's starting point and proposed control surface.

### From a photograph to an adventure

1. **Capture reality.** Use the mobile camera, a photo, or a short video of everyday objects.
2. **Discover the objects.** Meta **Muse Spark 1.3** observes visible objects, their normalized image locations and their relationships.
3. **Awaken the realm.** **Muse Image 1.0** reimagines the exact scene as an original magical keyframe, preserving its recognizable arrangement.
4. **Receive a physical quest.** A deterministic planner chooses a safe movable object and a distinct target (for example, bring a cup closer to a smartphone).
5. **Make a real change.** Capture the scene again after moving an object.
6. **Qualify the evidence.** Muse Spark observes the before-and-after frames; an independent numerical verifier evaluates object identity, visibility, confidence, camera consistency, relative displacement and final proximity.
7. **Unlock the result.** Qualified movements authorize the next game state, local cinematic effects and an updated generated image.

The model is the **perception and imagination engine**. It does not independently authorize success. That decision belongs to transparent, deterministic code in `lib/geometry.js`. Outcomes are `SUCCESS`, `NOT_YET`, `NO_CHANGE` and `UNCERTAIN`.

### Meta technologies

| System | Role |
| --- | --- |
| **Muse Spark 1.3** | Multimodal visual scene understanding, structured JSON and paired-frame observations |
| **Muse Image 1.0** | Photo-conditioned original fantasy-world generation |
| **SAM 3.1** | Optional segmentation refinement |
| **Deterministic verifier** | Fail-closed physical-action qualification |
| **Browser runtime** | Camera/photo/video, local effects, lightweight tracking, audio and quest UI |

The prototype uses Vercel Node serverless functions, vanilla JavaScript, browser camera APIs, original effects and a GitHub Actions test workflow. Browser camera/video preview and frame extraction run locally. Paid inference occurs on explicit player requests rather than every video frame.

### Evidence from the submitted build

- **14 / 14 automated tests passed**, including object selection, physical geometry, no-change rejection, camera shift and low-confidence handling.
- The deployed production endpoint successfully used **Muse Spark** to recognize **four real tabletop objects** and generate an original world: **The Pale Archive of Stillwood**.
- A production **Muse Image** request produced the original fantasy transformation shown in the demo.
- A production before/after request containing an unchanged real scene correctly returned `NO_CHANGE` with relative movement `0`.
- The source is public and the web app is deployed at **https://realmforge-meta-worlds.vercel.app/**.

The 2:55 video includes a real-world tabletop source clip, actual saved Meta Model API outputs, and a captured browser walkthrough. The walkthrough replays the recorded model outputs for a predictable demo recording. These tests exercise particular scenarios rather than establishing a universal real-world tracking accuracy rate; see [DEMO_EVIDENCE.md](./DEMO_EVIDENCE.md) for the precise provenance.

### Quick start

1. Clone this repository and install Node 20+.
2. Use `npm run check` for syntax and automated tests.
3. Deploy with Vercel and configure server-only `MODEL_API_KEY` and `DEMO_ACCESS_CODE` environment variables.
4. Open the live application in a secure browser. Choose **Live Camera**, **Photo** or **Video** and provide a private demo access code for model calls.
5. Use visually distinct real objects and a stable camera. Awaken the scene, move an object, and capture the after-view to verify.

For cost protection, the public API is gated by a demo code and request-rate logic. **Do not publish a private access code or your Meta API key in the repository.**

### Project structure

```
index.html, live.css, live.js    Browser application
effects.js, tracker.js          Original local visual effects and feature tracker
api/analyze.js                  Muse Spark object grounding and narrative
api/transform.js                Muse Image photo transformation
api/verify.js                   Before/after observations and verdict
api/segment.js                  Optional SAM segmentation
lib/geometry.js                 Independent numeric scene verifier
lib/quest.js                    Physical quest selection
lib/meta.js                     API validation and access protection
test/*.test.mjs                 Automated verification cases
demo.mp4                        Competition demonstration (2:55)
DEMO_EVIDENCE.md                Evidence and demo provenance
```

**Made for Meta Global AI Developer Hackathon, 26 October – 4 November 2026.**
