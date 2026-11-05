# REALMFORGE LIVE — Test and Demo Evidence

**Competition:** Meta Global AI Developer Hackathon 2026  
**Track:** Indie Developer / Build for Your World  
**Demo:** [Watch 2:55](./demo.mp4)

## Independently exercised production paths

1. **Muse Spark 1.3 scene understanding.** A genuine photographed tabletop frame, from a licensed real-world video, was sent to the deployed `/api/analyze` endpoint. Meta returned HTTP 200, identifying a laptop, cup, smartphone and notebook and generating **The Pale Archive of Stillwood** with coordinate-grounded object identities.
2. **Muse Image 1.0 generation.** The deployed `/api/transform` endpoint returned HTTP 200 and an original, retrievable fantasy image grounded in the same photo.
3. **No-change verification.** The deployed `/api/verify` endpoint received identical real tabletop before/after images. It returned `NO_CHANGE`, model-observed confidence **0.92**, and relativeMovement **0**.
4. **Automation.** The repository's syntax, model-contract and geometric tests passed **14/14**.
5. **Web delivery.** The public GitHub repository, Vercel app and its status endpoint were accessible during pre-submission verification.

## How to interpret the video

The 2:55 narrated demonstration combines:

- A real tabletop recording from [Coverr — Getting Ready to Work](https://coverr.co/videos/getting-ready-to-work-oqlx54cmzf), credited for its commercially reusable footage.
- Real, previously recorded **Muse Spark** observations and the actual **Muse Image** fantasy result from production calls.
- A screen-captured REALMFORGE frontend walkthrough using those recorded model responses to reproduce the visual sequence consistently.
- A summary of the independent geometric verifier and the verified no-change result.

The project implements a positive physical-transition path and tests it deterministically. The recorded demonstration is **not presented as a live positive movement field test**. Its demonstrated live model outcomes are the ones listed above.

## Design and claims

The application creates cinematic **still-image keyframes** and local effects over a real camera feed. It does not claim continuous AI-generated video, full SLAM tracking or a 3D mesh. Muse Spark's object boxes remain model observations; independent geometry qualifies their suitability for a state transition.

The browser and server require a private demo access code for paid model calls. Reviewers can watch the public video and inspect the source without that code; interactive inference requires private credentials.

## Source

[Repository](https://github.com/alensonyjoseph/realmforge-meta-hackathon) · [Live app](https://realmforge-meta-worlds.vercel.app/)
