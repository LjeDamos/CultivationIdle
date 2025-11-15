import { ATTRIBUTES, attributeTooltips } from '../data/attributes.js';
import { SKILLS, makeInitialSkills } from '../data/skills.js';
import { RACES } from '../data/races.js';
import { defaultTraitPool } from '../data/traits.js';
import { addLog } from '../systems/logs.js';
import { calcLevel } from '../systems/formulas.js';

export function newGameState() {
  const now = Date.now();
  const G = {
    version: 1,
    createdAt: now,
    lastTickAt: now,
    engine: {
      tickSpeed: 1.0, // 1x
      tickHz: 20,
      timeScale: 1.0,
    },
    flags: {
      forceReincarnate: false,
    },
    unlocks: {
      automation: false,
      ascension: false,
    },
    player: {
      name: 'Nameless',
      age: 16.0,
      lifespan: 60.0,
      race: null,
      attributes: Object.fromEntries(Object.keys(ATTRIBUTES).map(k=>[k, 5])),
      skills: makeInitialSkills(),
      level: 1,
      traits: [],
      traitPool: defaultTraitPool(),
      resources: {
        qi: 0,
        stones: 0,
        materials: { herb: 0, ore: 0, beast: 0 },
        insight: 0,
        reputation: 0,
      },
      activities: {
        active: null,
        queue: [],
        unlocked: { meditate: true, gather: true },
      },
      automation: {
        managers: {},
        scripts: {},
      },
      realms: {
        current: 'Mortal',
        unlocked: ['Mortal'],
      },
      achievements: {},
      messageLog: [],
      best: {
        maxSkillLevels: {},
        bestLevel: 1,
      },
    },
    meta: {
      layer1: { xpMult: 0, points: 0 },
      layer2: { currency: 0, upgrades: {} },
      layer3: { bloodlines: {}, unlocked: false },
      layer4: { seeds: {}, unlocked: false, current: 'Prime' },
    }
  };
  // Seed: initial guidance messages
  addLog(G, 'A faint spark stirs within. Meditate to gather Qi.');
  addLog(G, 'Choose a race and select 3 traits to shape this life (Traits tab).');
  return G;
}

export function migrateState(S) {
  // Simple forward-compatible migrator
  const G = S;
  if (!G.version) G.version = 1;
  if (!G.meta) G.meta = { layer1:{xpMult:0,points:0}, layer2:{currency:0,upgrades:{}}, layer3:{bloodlines:{},unlocked:false}, layer4:{seeds:{},unlocked:false,current:'Prime'} };
  if (!G.unlocks) G.unlocks = { automation:false, ascension:false };
  if (!G.flags) G.flags = { forceReincarnate:false };
  if (!G.engine) G.engine = { tickSpeed: 1.0, tickHz: 20, timeScale: 1.0 };
  if (!G.player.activities) G.player.activities = { active:null, queue:[], unlocked:{meditate:true,gather:true} };
  return G;
}
