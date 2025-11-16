# Alert - AI slop generated web app. Currently hollow prototype.

# Lje-Cultivation-Idle – Design Document  

### High concept  

Lje-Cultivation-Idle is an idle cultivation life-sim where a character grows from humble beginnings into a reality‑shaping immortal by mastering skills, optimizing loops, and reincarnating through sequential meta layers.
Moment‑to‑moment play flows from clicking and micro‑optimization to automation, multi‑layer prestiges, and a late‑game grand objective that reframes prior systems at a near‑cosmic scale.
The design is tuned from day one to avoid multi‑prestige fatigue, pacing stalls, and scope creep via explicit run‑time reduction targets, softcaps, and spreadsheet‑driven balancing.
Discovery‑driven onboarding, progressive reveals, and measurable time‑to‑reset goals maintain momentum for both active and idle play across long sessions and offline windows.

### Pillars  

Skills define power and accelerate themselves so that actions both produce resources and improve future speed, mirroring life and job skill loops from Progress Knight while remaining tailored to cultivation fantasy.
Multiple prestige layers with optional challenge modifiers create long‑term compounding gains and new run‑planning, inspired by Evolve‑style resets but constrained by pacing safeguards from idle design postmortems.
A minimalist, readable interface with logs and compact surfaces optimizes idle clarity and reduces friction, following a text‑first philosophy similar to Progress Knight but extended with modern UX patterns and ETAs.
Risk‑aware systems explicitly target known idle pitfalls such as over‑automation, snowballing economies, and overwhelming onboarding through staged unlocks and softcaps.

### Design risks and mitigations  

Each new prestige or meta layer must visibly cut repeat time to key milestones, targeting roughly a 30–50 percent faster path to the previous wall and surfacing expected gains per unit time in the UI.
Pacing cliffs are avoided by defining explicit softcaps and breakpoints for all major growth paths, ensuring slopes flatten instead of producing hard walls while late‑game scarcity sinks stabilize inflation.
Early over‑automation is prevented by staggering automation unlocks so that manual interaction yields bonuses and discoveries in early sessions, with managers and scripting arriving only in mid to late midgame.
Balancing drift is controlled by centralizing costs and multipliers in auto‑calculating spreadsheets and parameter weight models used to keep new content consistent with previous layers.
Onboarding complexity is managed through interactive teach‑by‑doing steps, checklists, and progress bars that branch on chosen race and traits instead of front‑loading static text walls.
Scope creep is constrained by time‑boxed milestones, a vertical‑slice first approach, and telemetry‑driven iteration before expanding content breadth.

### Core loop  

Players click to bootstrap base resources and skill XP, with each activity leveling an associated skill that multiplicatively improves that same activity’s speed or yield.
As production grows, players transition into management by unlocking batching, queues, and simple managers that keep training and harvesting running efficiently while active and idle.
Later, conditional scripts, formations, and seed‑specific automation unlocks allow deep optimization for advanced players without being mandatory for basic progression.
Runs end or reset via lifespan expiry, ascension layers, or challenges, converting progress into meta resources that make subsequent runs faster and open fresh systems.
The UI surfaces expected run‑time savings and marginal returns to help players choose when to reset instead of relying on external guides.

### Player creation  

Each run starts by choosing a race, then picking three starting traits from nine randomized options drawn from an achievement‑expanded trait pool.
A reroll option consumes a minor early resource so players can chase interesting synergies without falling into heavy analysis paralysis.
Races alter attribute growth curves, early skill synergies, and available route hooks while avoiding hard locks on late‑game content, echoing Evolve‑style evolutionary paths.
Onboarding branches by race, offering short race‑specific tasks that highlight unique strengths instead of relying solely on generic tutorials.

### Races  

Human focuses on balanced attribute growth and flexible build paths, making it an ideal first‑clear and reference race.
Elf emphasizes SPIRIT and AGI scaling, granting faster cultivation breakthroughs and more efficient meditation‑driven progress at the cost of physical robustness.
Demonkin leans into STR and VIT, rewarding aggressive challenge play and combat‑heavy routes with stronger physical output and survival.
Spiritfolk specialize in Qi efficiency and meditation speed while starting with weaker physical stats, favoring players who enjoy optimization and non‑combat progress.
Undying gain extended lifespans and death mitigation tools but suffer reduced early XP gains, inviting slower, long‑plan styles that exploit late‑life snowballing.
Dragonkin require steep XP investment yet pay off with exponential late scaling, existing as a high skill‑ceiling race for players who master the meta layers.

### Traits system  

Each run, players pick three traits from nine options sampled from an expanding achievement‑gated pool, promoting variety and long‑term collection goals.
Example traits include Quick Learner for global skill XP, Iron Body for damage reduction and VIT scaling, Qi Conduit for SPIRIT‑based production, Artisan for crafting output, and Strategist for formation and leadership efficiency.
Traits have tiered upgrades unlocked via achievements and meta currencies, with diminishing returns at higher tiers to prevent any single trait from dominating all builds.
One mid‑run respec token per life allows undoing dead‑end trait choices and is purchasable in Layer 2 meta, increasing long‑term flexibility without trivializing planning.

### Attributes  

The core attributes are STR, VIT, AGI, SPIRIT, INT, and LUCK, each feeding specific skills and systems that define broad build archetypes.
STR affects physical damage and carrying capacity, supporting martial and labor‑intensive activities.
VIT governs health, regeneration, and lifespan buffers, deeply interacting with lifespan and challenge survivability.
AGI controls action speed and dodge‑like multipliers, improving both combat responsiveness and throughput of time‑sensitive activities.
SPIRIT drives cultivation rate, Qi regeneration, and magical scaling, synergizing with meditation, techniques, and spiritual breakthroughs.
INT boosts research speed, knowledge caps, and formula‑driven bonuses, accelerating tech trees and mathematical optimizations.
LUCK influences rare event frequency, high‑tier drop multipliers, and crit‑like effects, creating spike moments and supporting exploratory playstyles.
Attribute‑linked bonuses use smoothing curves and piecewise softcaps so that extreme stacking yields diminishing marginal returns rather than hard caps or runaway growth.

### Skills and activities  

Every major activity maps to a skill, and performing that activity grants skill XP while the current skill level acts as a self‑multiplier on that activity’s effectiveness.
Core skills include Meditation, Martial Arts, Alchemy, Crafting, Trading, Research, Exploration, Leadership, Formation, and Inscription, each supporting both idle and active variants where appropriate.
Cross‑skill synergies discourage single‑skill tunneling; for example, Leadership and Formation can amplify Martial Arts and Exploration, while Research unlocks efficiencies for multiple skills.
Key activities provide both idle modes and active bursts, allowing players to choose between relaxed passive play and short optimization sessions without mandatory clicking.

### Character level from skills  

Character level aggregates skill levels using an $$L_p$$ style norm to reward both breadth and depth of training.
The formula is defined as $$Level = \left\lfloor \alpha \cdot \left(\sum_i s_i^{p}\right)^{1/p} \right\rfloor$$ where $$p$$ is tuned around $$1.5$$ and $$\alpha$$ controls overall pacing, with values adjusted via balancing sheets.
This aggregation ensures that specializing in a few skills or maintaining a broad set of mid‑level skills both contribute meaningfully to progression.
Level‑ups grant attribute points, unlock new activities and automation tiers, and may gate access to certain realms, challenges, or meta systems.
The UI highlights marginal benefit of leveling breadth versus specialization so players can make informed decisions about training focus.

### Progression arc  

Early game emphasizes clicking and short‑term goals such as bootstrapping Qi, basic resources, and initial skill levels.
As players grow, they unlock batching, queues, and helpers or disciples, shifting focus toward managing schedules and efficiency thresholds.
Midgame introduces job or skill managers and formation presets that keep systems running with minimal interaction while still rewarding occasional active adjustment.
Late midgame and beyond unlock conditional scripting and seed‑aware automation that respond to thresholds, events, and challenges.
Ascension layers and advanced meta systems transform long‑run planning, prompting players to target specific milestones before resetting for compounding gains.

### Resources and economy  

Qi and Spirit Stones power cultivation, techniques, and breakthroughs, forming the backbone of spiritual progress.
Materials such as ores, herbs, and beast parts feed crafting and alchemy pipelines that generate tools, gear, and powerful elixirs.
Insight or Research acts as a knowledge currency to unlock formulas, technology nodes, and inscription arrays that modify multiple systems.
Reputation or Prestige gates disciples, sect‑wide perks, and world effects, contributing to long‑term account‑style progression.
All major currencies have designed sinks tied to breakthroughs, crafting, research, and realms, with late‑game scarcity valves to prevent runaway inflation.
Softcaps and alternate resource gates are used to avoid a single optimal build dominating and to keep different routes viable into late game.

### Automation  

Automation milestones unlock in three broad tiers: early batching and queues, midgame managers with priorities, and late midgame conditional scripts and formation presets.
Early game retains partial manual interaction by granting bonuses and discoveries for clicking or actively managing within the first sessions.
Managers assign workers or disciples to tasks, automatically maintaining training, crafting, or exploration loops within player‑set constraints.
Conditional scripting allows rules such as switching activities when storage is full, when a realm chance exceeds a threshold, or when XP efficiency dips below a target.
Formations serve as high‑level automation templates, especially in combat or multi‑entity scenarios, capturing complex strategies in reusable presets.

### Lifespan and reincarnation  

Each run has an estimated lifespan that decreases as age increases, and exceeding that lifespan ends the life cycle and forces a reset.
On life end, the game awards Layer 1 skill XP multipliers based on best single‑life skill milestones and overall time efficiency, encouraging smart reset timing.
Lifetime extension sources include VIT scaling, cultivation breakthroughs, rare elixirs, and certain realm rewards, but each extension exhibits diminishing returns to avoid endless overlong runs.
The tension between pushing further within a life and banking meta gains is central to run‑planning and pacing.

### Meta progression layers  

Layer 1 grants a skill XP multiplier on reincarnation, typically modeled as $$1 + \beta \cdot f(\text{max skill levels})$$ so that pushing certain skills high in a run meaningfully boosts future training speed.
Layer 2 provides a metacurrency spent on global speed upgrades, attribute scaling boosts, automation depth, and expansion of the starting trait pool.
Layer 3 introduces Bloodlines, race‑bound memory trees that unlock race‑specific nodes and cross‑run synergies after several reincarnations.
Layer 4 unlocks World Seeds, alternate world rule sets that reshape constants, resource distributions, and system interactions to encourage fresh strategies.
Meta layers are revealed sequentially so each new layer recontextualizes earlier decisions instead of overwhelming players early.

### Ascension and challenges  

Ascension converts capped or plateaued progress into higher‑tier meta unlocks, new currencies, and systemic rule changes that strongly affect buildcraft.
Optional challenge modifiers temporarily remove conveniences or impose constraints in exchange for permanent mastery‑style rewards.
Challenge designs reference common idle pitfalls by rewarding time‑to‑reset improvements, non‑automation runs, or race‑specific feats to diversify goals.
Each challenge displays estimated time‑to‑complete and projected run‑time savings from the reward to make engagement feel worthwhile and transparent.

### Achievements  

Achievements span milestone, mastery, speedrun, challenge, and world seed victory categories to provide both short‑term and long‑term goals.
Achievements award metacurrency, unlock new starting traits, and upgrade existing trait tiers, strengthening early‑game variety across many runs.
Additional dailies and weeklies apply small modifiers and micro‑goals, increasing return frequency without strongly distorting long‑term balance.

### Message log  

A compact message log records notable events such as breakthroughs, rare drops, realm successes, and boss clears, stacking identical messages with a succinct count marker.
Filters and pins ensure that important lifecycle events such as lifespan thresholds, recommended reset prompts, and challenge completions remain visible in a minimalist interface.
Periodic session recaps and offline summaries draw from the log to highlight progress and suggest next actions on return.

### Endgame goal  

The long‑term narrative goal is to forge a Heaven‑Defying Dao by completing grand sect projects, unifying world seeds, and constructing a Celestial Foundry that converts entire worlds into essence.
Endgame sequences unlock a cosmos‑creation ascension where runs seed the constants of a new universe, reframing races, traits, and skills as underlying laws rather than character‑scale abilities.
This finale repurposes earlier systems so that late‑game players engage with familiar mechanics in radically different strategic contexts.

### Breakthroughs and realms  

Cultivation realms gate major multipliers, new techniques, and lifespan increases, requiring Qi, materials, and sometimes challenge clears to attempt breakthroughs.
Attempts can include success odds and pity systems so that failure never triggers irreversible spirals, keeping progression pressure but avoiding frustration.
Later realms integrate with world seeds so that chosen paths apply physics‑like modifiers to entire runs and influence which builds remain viable.

### Techniques and formations  

Techniques provide active skills and passive effects that consume Qi, allowing targeted bursts of power, defense, or efficiency tuned to specific situations.
Formations enhance multi‑entity scaling by coordinating disciples, allies, or constructs to amplify stats and automate tactical choices.
Preset formations teach thresholds and resource breakpoints, then gradually open into fully programmable templates that tie into the advanced automation layer.

### Combat and exploration  

Lightweight auto‑combat yields materials and rare drops, with scaling driven by Martial Arts, Formations, Leadership, and physical attributes like STR and AGI.
Exploration unlocks biomes, dungeons, anomalies, and seed‑specific locations, each offering unique resource profiles and event pools.
Rotating event modifiers and time‑limited curios reduce grind by providing distinct short‑term goals inside broader idle progression.

### Crafting and alchemy  

Crafting converts materials into gear, tools, and infrastructural upgrades that boost specific activities and unlock new automation stages.
Alchemy produces elixirs and consumables that affect lifespan, breakthrough odds, and temporary multipliers, reinforcing cultivation theming and creating strong but consumable power spikes.
Crafting and alchemy both serve as major sinks for materials and Qi, stabilizing late‑game currencies and supporting long‑term build differentiation.

### Economy formulas and balancing  

Skill XP per tick follows a multiplicative model such as $$XP_s = b_s \cdot (1 + M_{\text{skill}}) \cdot (1 + A_{\text{attr}}) \cdot \Pi U$$, where $$M_{\text{skill}}$$ includes Layer 1 and trait bonuses and $$U$$ represents distinct upgrade categories that stack multiplicatively only across categories.
Activity output uses a self‑multiplier like $$O_a = O_0 \cdot (1 + \gamma \cdot s)^{k}$$ with exponent $$k < 1$$ beyond certain breakpoints to implement smooth softcap curvature.
Rebirth reward curves such as $$R = \log(1 + \sum s_i^{q})$$ ensure early resets feel impactful while leaving midgame and late game progression meaningful.
Price curves primarily use geometric growth with occasional plateau windows to enable satisfying bulk purchases and spend spikes without trivializing costs.
Spreadsheet‑driven balancing with global knobs for costs, caps, slopes, and multipliers supports consistent tuning across many skills and systems.
Simulation passes estimate time‑to‑goal for key milestones and feed ETAs into the UI to guide players toward efficient reset and upgrade decisions.

### Unlock sequencing and offline progress  

Batching and queues unlock early to reduce click spam while preserving engaging short sessions.
Managers become available in mid levels, and scripting appears in late midgame to prevent cognitive overload and to reward players who stay invested.
World Seeds and top‑tier meta layers appear only after at least one ascension, ensuring that earlier systems feel fully explored before the rules shift dramatically.
Offline progress uses deterministic ticks capped by storage and manager tiers, producing predictable resource and XP gains during inactivity.
On return, players see clear offline summaries including capped losses, completed queues, and newly available actions or recommended resets.

### UX and onboarding  

The interface favors text‑first panels with expandable detail, sortable lists, and at‑a‑glance multipliers to keep information dense but readable.
Contextual tooltips explain formulas, multiplier sources, and softcap behavior so that optimization play feels transparent rather than opaque.
Onboarding teaches core interactions inside the game flow using scaffolded objectives, checklists, and milestone previews instead of long pre‑game tutorials.
Goal visibility is maintained through progress bars and race or trait specific mini‑objectives that hint at deeper systems without overwhelming new players.

### Monetization and retention (optional)  

If monetization is added, it prioritizes fun and fairness, avoiding progress blocks and instead offering value‑forward bundles aligned with natural session breaks.
Ads, if any, are opt‑in and tied to non‑critical boosts or cosmetics to preserve the integrity of long‑term progression.
Retention levers include regular content updates, rotating events, social comparisons, and challenge ladders, all tuned using telemetry and A or B tests.

### Technical notes  

The game targets a performant HTML5 or JavaScript single‑page application with robust autosave, import or export, and resilience to tab suspensions.
Core content such as races, traits, skills, realms, and seeds is defined via data‑driven configurations so that balancing and content expansion can occur without code changes.
Analytics track metrics such as time‑to‑reset, session length, abandonment points, and feature adoption to support ongoing tuning and live‑ops decisions.

### Roadmap  

The vertical slice milestone focuses on core click loops, a small set of skills, a single breakthrough path, and basic reincarnation with Layer 1 meta and simple onboarding checklists.
Midgame development introduces managers, expanded trait pools, early challenges, Layer 2 meta, and the first ascension with visible run‑time savings over previous runs.
Late‑game and live‑ops work add Bloodlines, World Seeds, advanced formations and scripting, rotating events, and endgame celestial projects culminating in cosmos‑creation ascension.
