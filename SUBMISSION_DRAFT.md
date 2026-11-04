# REALMFORGE LIVE — Hackathon submission draft
**Track:** Indie Developer
**Category:** Build for Your World (with a Push-the-Frontier technical angle)
**Name:** REALMFORGE LIVE
**Tagline:** Reality is the controller.
**Live app:** https://realmforge-meta-worlds.vercel.app/
**Public GitHub:** https://github.com/alensonyjoseph/realmforge-meta-hackathon
**Video:** NOT YET RECORDED — REQUIRED BEFORE FORM SUBMISSION.

## Elevator pitch (copyable)

REALMFORGE LIVE turns the objects already in your room into the controls of a cinematic AI-generated adventure. Point your phone at a cup, book and keys. Meta Muse Spark identifies those *actual objects*, invents a coherent magical world and proposes a physical objective. Muse Image transforms the photograph into original fantasy art. Now physically move the real objects—not digital sprites—and the app compares before/after camera frames, uses Meta vision for grounded observations and applies an independent fail-closed geometric verifier. When the physical action is proven, the fantasy realm visibly awakens and a new cinematic image reflects the changed scene.

## Full submission description (copyable, revise after genuine live test)

Most AI world generators create worlds you enter on a screen. REALMFORGE LIVE starts from the world you already inhabit. A photo or live camera scene is understood with Meta Muse Spark 1.3 and converted into structured object identities, normalized positions and an original quest. Muse Image 1.0 edits the *same photographic input* into a cinematic fantasy setting without requiring 3D artists or prebuilt character assets. REALMFORGE's deterministic mission planner selects a movable physical object and separate target. The player moves the real item while keeping the camera active, then asks the app to verify the move. Muse Spark compares before and after images; independent numerical rules evaluate visibility, camera stability, relative movement and proximity. A hallucinated AI description alone cannot trigger success. Only verified physical interaction unlocks a new spell and an updated cinematic keyframe. Optional SAM 3.1 segmentation improves object locations. Real-time particle effects and low-cost local tracking run in the browser; Meta is invoked only on user actions.

The experience also accepts paired photographs and short 2–35-second video clips, allowing a physical game to emerge from any ordinary environment, including classrooms, homes, makerspaces and accessible creative-play activities. It is intentionally **not a claim of full 3D spatial tracking or continuous AI-synthesized video**.

## What is genuinely new about the use of Meta

The project uses the **user's physical reality as input and control**, not just as a prompt. Muse Spark supplies contextual perception and a structured game world; Muse Image creates cinematic keyframes grounded in the exact scene; optionally SAM refines object positions. Most importantly, the game treats the models as *fallible observers* and gives final state-transition authority to deterministic code. This makes a generated scenario interact with actual physical events.

## Technical stack

Vanilla ES modules and responsive CSS; Meta Model API (Muse Spark 1.3, Muse Image 1.0, optional SAM 3.1); Node 22 Vercel serverless functions; original browser Canvas and Web Audio effects; local feature correlation tracking; deterministic geometric validation of normalized object boxes; GitHub Actions automated test suite. The repository history shows source created during the event.

## Verified engineering evidence

- 13 deterministic tests passing on Windows, covering positive and negative physical-verification cases.
- GitHub CI green with pinned dependency actions.
- Live deployment confirmed HTTP 200; /api/verify route responds with 405 to GET (correct POST-only policy).
- Automated Chrome smoke tests: photo workflow, camera preview, short MP4 video local frame extraction, full simulated end-to-end game sequence, mobile viewport no horizontal overflow and no browser JS errors.
- The previous static REALMFORGE build successfully generated a real original Muse Image fantasy chalice from a user's cup photograph, with playable tap-quest completion.
- **The new physical movement verification has NOT yet passed a live two-photo Meta test. Do not change this item until an authentic success is recorded.**

## Strict demonstration script, max 180 seconds

00:00–00:12 · Show real objects arranged on a desk, wide shot. "A cup, a book and keys. No special hardware. This is my game controller."
00:12–00:34 · Open REALMFORGE LIVE in mobile Chrome. Start Live Camera, grant permission, capture the starting scene, select the chosen fantasy theme.
00:34–01:00 · Tap Awaken. Show *actual* Muse Spark-generated realm identity and Muse Image-generated fantasy keyframe. Toggle camera vs enchanted view.
01:00–01:30 · Read the generated physical mission. Without interrupting the camera, physically move the requested object beside its target. Camera feed shows hand movement.
01:30–01:58 · Press Verify. Show the *actual* live independent verifier result. Stop here if result isn't a verified success; do not substitute a mocked result.
01:58–02:23 · On verified success, show particles, light-beam effect, victory status and original post-action Muse Image reimagining.
02:23–02:45 · Show the architectural distinction: Meta vision observes; local deterministic rules decide. If no time, use concise overlaid explanatory captions.
02:45–03:00 · Show three input modes (camera/photo/video), public GitHub repo and impact: any ordinary surface can become a personalised game.

OPTIONAL: In place of 02:23–02:45, show the same still frame before and after yielding NO_CHANGE or UNCERTAIN, if a live test actually verified it. No claims about SAM segmentation unless a live SAM request was demonstrated.

## Reviewer instructions

1. Open the live app in Chrome or another browser that supports camera permissions.
2. Enter the private demonstration access code, supplied ONLY through a private review channel.
3. Put at least three visibly distinct objects spaced apart on a desk; cup/book/keys is ideal.
4. Use Live Camera, Photo, or Video. For Live Camera, allow camera permissions and keep the phone as steady as possible.
5. Capture a baseline, click Awaken, physically move the requested real object and press Verify.
6. Success is intentionally denied when objects don't move, the scene is ambiguous, or the camera angle changes too much.
7. Use *Realm / Reality* to switch between live camera and generated cinematic keyframe.

## Must pass before submitting

- [ ] Verify one actual live movement-to-magic interaction with the production Meta backend.
- [ ] Verify at least one unchanged-scene rejection with the production Meta backend, or disclose that only deterministic unit tests cover this behaviour.
- [ ] Record and upload an accessible demo video no longer than three minutes using the authentic interface and result.
- [ ] Ensure demo access for the judge without exposing an unlimited paid model endpoint.
- [ ] Check project name, track, category, source repo and live URL on Cerebral Valley.
- [ ] Submit the event form by **4 November 2026, 9 PM ET / 5 November 2026, 2 AM UK**.

**Do not claim that submission has happened until the form confirmation is shown.**
