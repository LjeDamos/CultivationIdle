import { State, logEvent } from './state.js';
import { CONSTANTS } from '../data/config.js';
import { updateSkills, recalcCharacterLevel } from '../systems/skills.js';

let autosaveTimer = 0;

export function gameTick(dt) {
  // Age increases slowly; 1 year per 10 minutes of active time (example)
  State.character.ageYears += dt / (60 * 10);
  // Core systems
  updateSkills(dt);
  recalcCharacterLevel();

  // Unlock pacing
  const lvl = State.character.level;
  if (lvl >= 2) State.ui.unlocks.skills = true;
  if (lvl >= 3) State.ui.unlocks.log = true;
  if (lvl >= 5) State.ui.unlocks.traits = true;
  if (lvl >= 6) State.ui.unlocks.races = true;

  // Autosave
  autosaveTimer += dt;
  if (autosaveTimer >= State.autosaveSec) {
    autosaveTimer = 0;
    const ev = new CustomEvent('do-autosave');
    window.dispatchEvent(ev);
  }
}

export function runLoop() {
  const now = performance.now();
  const dt = Math.min(0.25, (now - State.time.lastTs) / 1000); // clamp dt
  State.time.lastTs = now;

  // Fixed tick subdivision
  State.time.accumulated += dt;
  const step = 1 / CONSTANTS.TICKS_PER_SEC;
  while (State.time.accumulated >= step) {
    State.time.accumulated -= step;
    gameTick(step);
    const ev = new CustomEvent('ui-update');
    window.dispatchEvent(ev);
  }
  requestAnimationFrame(runLoop);
}
