# FINAL HACKATHON SUBMISSION — REALMFORGE LIVE
Meta Global AI Developer Hackathon · 5 November 2026

**Team:** REALMFORGE LIVE
**Member:** Alen Sony Joseph
**Track:** Indie Developer Track
**Theme:** Build for Your World
**Viral X link:** Optional, leave blank if none
**Repository:** https://github.com/alensonyjoseph/realmforge-meta-hackathon
**Demo (2:58):** https://github.com/alensonyjoseph/realmforge-meta-hackathon/blob/main/demo.mp4
**Application:** https://realmforge-meta-worlds.vercel.app/

## PROJECT DESCRIPTION (max 3,000 characters)

REALMFORGE LIVE — REALITY IS THE CONTROLLER.

Games have always asked us to enter someone else's world. REALMFORGE reverses that idea: what if a game could be created from the world you're already in?

Point a phone at an ordinary desk. A cup, notebook and smartphone become the ingredients for an original fantasy adventure. Meta Muse Spark recognizes the actual objects and their locations, then invents a magical world and a quest that makes sense for that scene. Muse Image turns the photograph into cinematic fantasy artwork. The cup becomes an enchanted chalice; the phone becomes a scrying shard. It's your real space, reimagined.

But REALMFORGE isn't just an image generator. The objects become the gameplay. A mission might ask you to move the real cup beside the phone. After the move, a second captured image lets the system evaluate what physically changed. Muse Spark observes the before-and-after scenes; independent deterministic code checks identity, visibility, camera consistency, relative movement and final proximity. Only qualifying evidence advances the quest, triggering magical browser effects and an updated fantasy keyframe.

The mobile-first prototype includes live camera, photo and short-video input, a physical quest engine, optional SAM 3.1 segmentation, original local effects, and production Meta Model API integrations deployed on Vercel.

We verified real Muse Spark recognition of four objects, a real Muse Image fantasy transformation, and a production NO_CHANGE result on an unchanged tabletop. All 14 automated tests passed. The source, live app and narrated 2:58 demonstration are public.

REALMFORGE points toward a new kind of accessible, personalized AI play: no prebuilt levels, no specialist controllers, just imagination grounded in the objects around you.

Try it: https://realmforge-meta-worlds.vercel.app/

## USE OF META PRODUCTS (max 3,000 characters)

Meta's models power the game's core experience—not merely its development.

MUSE SPARK 1.3 — VISUAL GROUNDING AND QUEST DESIGN
The application's multimodal API calls interpret a real captured image and return structured scene data: object identities, normalized bounding boxes, magical roles, a named world and actionable physical quests. For verification, Muse Spark observes separate before-and-after images of the physical scene. This connects generative storytelling to the user's real objects.

MUSE IMAGE 1.0 — PHOTO-CONDITIONED WORLD GENERATION
The image-editing endpoint reimagines the user's original photograph as a cinematic fantasy environment while retaining a recognizable composition. The same pipeline can generate a new keyframe after the physical quest qualifies, allowing the visual story to react to real-world events.

SAM 3.1 — OPTIONAL SPATIAL DETAIL
An optional segmentation pathway can refine the locations of recognized objects and enrich scene grounding.

INDEPENDENT TRANSITION ENGINE
Muse Spark supplies observations; it does not award success. The browser and server implement object selection and a deterministic verification gate that checks physical displacement, target proximity, confidence and camera consistency. The gate returns SUCCESS, NOT_YET, NO_CHANGE or UNCERTAIN and authorizes game-state changes only when the evidence qualifies.

The application uses Vercel serverless endpoints, JavaScript, browser camera APIs, local short-video frame extraction, original particle effects, visual feature tracking and Web Audio. Meta inference is invoked on explicit player actions rather than continuously on every camera frame.

Production calls confirmed Muse Spark four-object recognition, Muse Image generation and a correct NO_CHANGE rejection on identical scene images. The repository also passes 14 automated tests.

## WHY META'S MODELS MATTER (max 3,000 characters)

A typical AI game starts with a prompt and invents a world on a screen. REALMFORGE starts somewhere more personal: the objects actually sitting in front of you.

To make that work, imagination needs to be grounded in observation. Muse Spark doesn't just write a fantasy story; it identifies which real objects are visible, where they are, and how they might form a physical quest. Muse Image doesn't produce unrelated concept art; it transforms the same photograph into a magical version of the player's surroundings. The two capabilities give the world visual and spatial continuity.

The crucial design principle is separating imagination from authority. AI is excellent at recognizing patterns and creating possibilities, but an exciting narrative isn't evidence that a physical action happened. REALMFORGE therefore combines Meta's multimodal observations with an independent geometry-based decision engine. The AI can describe the spell; the game rules decide when the player has earned it.

That combination is what makes REALMFORGE different from a chatbot adventure, a static AI image generator or a conventional mobile game. The player's own environment becomes both the source material and the control surface.

The longer-term opportunity is an entirely new category of creative play that can begin on any ordinary tabletop—at home, in a classroom, or wherever imagination meets physical reality.

## REMAINING FORM CHOICES

- **Partner technologies feedback:** We integrated directly with Meta Model API and Vercel; Fireworks, Modal and Baseten weren't used for this prototype.
- **Likelihood of using Meta Model API:** Very likely
- **Overall opinion of Meta Model API:** Somewhat favorable (or Very favorable if that reflects your experience)
- **Recommend Meta Model API:** 4 / 5
- **Recommend Muse Code:** 3 / 5 (neutral; no direct comparative evaluation)
- **Biggest obstacle:** Something else — Making visual scene observations reliable enough for strict physical-action verification.
- **Meta compared with other models:** We've used other models but couldn't make a clear comparison.
- **Most important factor:** Quality of the answers and code.
- **Hardest part of switching:** Our product is tuned to our current model's behavior and prompts.
- **Potential production blocker:** Missing production features, such as batch processing or spending limits.
- **Publication permission:** Review and accept the permission if you agree to Meta/Cerebral Valley sharing and promoting submitted material.

**Deadline: 5 November 2026, 02:00 GMT. Submission is only complete after Cerebral Valley confirms it.**
