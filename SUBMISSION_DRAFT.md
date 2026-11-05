# Meta Global AI Developer Hackathon 2026 — FINAL SUBMISSION COPY

**Team:** REALMFORGE LIVE  
**Participant:** Alen Sony Joseph  
**Track:** Indie Developer  
**Theme:** Build for Your World  
**Repo:** https://github.com/alensonyjoseph/realmforge-meta-hackathon  
**Video:** https://github.com/alensonyjoseph/realmforge-meta-hackathon/blob/main/demo.mp4  
**App:** https://realmforge-meta-worlds.vercel.app/

## Project description

**REALMFORGE LIVE — Reality is the Controller.**

What if the objects already on your desk could become the controls for a fantasy game that doesn't exist yet?

REALMFORGE LIVE turns a camera view, photograph or short video of ordinary surroundings into the starting point for an original, AI-generated adventure. A cup can become a magical chalice. A phone can become a scrying shard. But the objects aren't just visual inspiration: they also give the player a physical quest.

Muse Spark 1.3 examines the source image, grounds visible objects in normalized coordinates and creates a world and quest around them. Muse Image 1.0 transforms that same photograph into original cinematic fantasy art, keeping the layout recognizable. A deterministic quest planner selects a movable real object and a distinct target.

Now the player can move an actual object in the room, capture the changed scene and ask REALMFORGE to verify it. Muse Spark observes both frames, while an independent geometric engine evaluates identity, visibility, confidence, camera consistency, relative displacement and proximity. Rather than accepting an AI-generated claim of success, the game qualifies the evidence before authorizing a transition, effects and a new fantasy keyframe.

The responsive prototype includes live camera, photo and short-video modes, a browser effects engine, optional SAM 3.1 segmentation, Vercel serverless APIs and public source code. It was built during the hackathon.

The production app successfully recognized four objects with Muse Spark, generated an original image with Muse Image and correctly rejected an unchanged physical scene. All 14 automated tests passed.

REALMFORGE's ambition is simple: personalized adventures that begin with the world you already inhabit. **Reality is the controller.**

Live: https://realmforge-meta-worlds.vercel.app/

## How Meta products were used

Meta AI powers the actual experience, not just the development workflow.

**Muse Spark 1.3** receives real camera or photo frames through the Meta Model API and returns structured scene information: object names, normalized bounding boxes, fantasy roles, narrative and quest steps. During physical-action verification it compares the before and after images and supplies conservative observations.

**Muse Image 1.0** reimagines the original captured photograph as an original fantasy world. The app can request an updated keyframe after a qualified physical action, creating a visual connection between reality and game state.

**SAM 3.1** is integrated as an optional segmentation route for refining object locations.

**Independent game engine:** The final verdict is produced by JavaScript geometry rules that evaluate normalized coordinates, visibility, object identity, camera stability, displacement and proximity. The model proposes and observes; independent code decides.

The browser handles camera capture, local video-frame extraction, visual tracking, particles and sound; Vercel hosts the serverless Meta API integration. A private access code and explicit request triggers control inference exposure.

Test results: successful production Muse Spark analysis of four real items; successful production Muse Image generation; unchanged-scene production verdict NO_CHANGE with zero displacement; 14/14 automated tests passing.

## Why Meta's models are essential

Most generated games begin with a designed virtual world. REALMFORGE begins with the player's **actual** world.

That requires the combination of grounded visual understanding and imagination. Muse Spark identifies what is really in the photograph, where the objects are, and how they can take part in a meaningful quest. Muse Image turns the same physical arrangement into an original cinematic environment. Together, they make an ordinary desk feel like a personal adventure without a predefined level or specialized hardware.

The second innovation is how we handle model uncertainty. Instead of letting generative text decide that an action happened, REALMFORGE uses the model as an observer and independent geometry as the state-transition authority. If the evidence is not sufficient, the game does not simply award a win.

This pairing—real-world grounding, original visual transformation and deterministic action qualification—makes Meta's multimodal models central to the experience. The goal is a new way to play: not just looking at an AI world on a screen, but having the objects around you take part in it.

## Survey

Partner technologies: Not used in this prototype; integrated directly with Meta Model API and Vercel.

Select authentic personal ratings. Recommended technical options: Very likely to use Meta Model API; Somewhat favorable or Very favorable overall; quality of answers/code matters most; comparing models was not controlled; testing a new model takes time; production constraints include predictable costs or mature quota controls.

**Submit through Cerebral Valley by 2026-11-05 02:00 GMT and retain a confirmation screenshot.**
