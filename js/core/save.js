import { State, initSkills, logEvent } from './state.js';
import { CONSTANTS } from '../data/config.js';

const KEY = 'cultivation_idle_save_v1';

export function saveNow() {
  const payload = JSON.stringify(State);
  localStorage.setItem(KEY, payload);
  logEvent('Game saved.');
}

export function exportSave() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(State))));
}

export function importSave(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const obj = JSON.parse(json);
    Object.assign(State, obj);
    logEvent('Save imported.');
  } catch {
    logEvent('Import failed.');
  }
}

export function loadOrNew() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    initSkills();
    logEvent('New run started.');
    return;
  }
  try {
    const obj = JSON.parse(raw);
    Object.assign(State, obj);
    // Ensure new keys exist after versions change
    State.ui ||= { currentTab: 'overview', unlocks: {}, log: [] };
    State.ui.unlocks ||= { skills: false, traits: false, races: false, log: false };
    for (const k of Object.keys(State.skills || {})) {
      State.skills[k].locked ??= false;
    }
    logEvent('Save loaded.');
  } catch {
    initSkills();
    logEvent('Save corrupted, starting new run.');
  }
}

// Deterministic offline catch‑up limited by simple caps
export function applyOfflineProgress() {
  const now = Date.now();
  const start = State.run.lifeStartMs || now;
  const elapsedSec = Math.min((now - start) / 1000, 60 * 60 * 4); // cap 4h

  // Advance age based on the same rate as the active loop (1 year per 10 minutes)
  State.character.ageYears += elapsedSec / (60 * 10);

  // Simple offline meditation equivalent (extend later with managers)
  const ticks = Math.floor(elapsedSec * 2); // ~2 actions per sec
  const qiGain = ticks * 0.1;
  State.resources.qi += qiGain;
  logEvent(`Offline gains applied: +${qiGain.toFixed(1)} Qi.`);
}
