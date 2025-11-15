import { CONSTANTS, SKILLS } from '../data/config.js';

export const State = {
  version: 1,
  time: { lastTs: performance.now(), accumulated: 0 },
  autosaveSec: CONSTANTS.AUTOSAVE_SEC_DEFAULT,
  resources: {
    qi: 0,
    stones: 0
  },
  character: {
    ageYears: CONSTANTS.AGE_START,
    race: 'human',
    level: 1,
    attributes: { STR: 1, VIT: 1, AGI: 1, SPIRIT: 1, INT: 1, LUCK: 1 }
  },
  run: {
    lifeStartMs: Date.now(),
    traitsChosen: [],
    traitOptions: []
  },
  skills: {},
  ui: {
    currentTab: 'overview',
    unlocks: {
      skills: false,
      traits: false,
      races: false,
      log: false
    },
    log: []
  }
};

export function initSkills() {
  for (const s of SKILLS) {
    State.skills[s.id] = {
      id: s.id,
      level: 0,
      xp: 0,
      locked: !!s.locked
    };
  }
}

export function logEvent(text) {
  State.ui.log.unshift({ t: Date.now(), text });
  if (State.ui.log.length > 200) State.ui.log.length = 200;
}

export function gainResource(key, amount) {
  State.resources[key] = Math.max(0, (State.resources[key] || 0) + amount);
}

export function setRace(id) {
  State.character.race = id;
  logEvent(`Race set to ${id}.`);
}
