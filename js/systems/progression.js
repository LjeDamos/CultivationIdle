import { ACTIVITIES } from '../data/activities.js';
import { addLog } from './logs.js';
import { format } from '../core/utils.js';

let lastSuggestAt = 0;

export function recommendResetIfAny(G) {
  // Simple heuristic: if age > 70% lifespan and skill gains in last minute low, suggest reset
  const now = Date.now();
  if (now - lastSuggestAt < 60000) return;
  if (G.player.age / G.player.lifespan > 0.7) {
    addLog(G, 'Consider reincarnating: diminishing returns detected.');
    lastSuggestAt = now;
  }
}

export function performReincarnateIfAny(G) {
  // handled in tick
}

export function checkUnlocks(G) {
  // Gating activities
  for (const [id, act] of Object.entries(ACTIVITIES)) {
    if (!G.player.activities.unlocked[id]) {
      const gate = act.gate || {};
      let ok = true;
      if (gate.level && G.player.level < gate.level) ok = false;
      if (gate.qi && G.player.resources.qi < gate.qi) ok = false;
      if (gate.insight && G.player.resources.insight < gate.insight) ok = false;
      if (ok) {
        G.player.activities.unlocked[id] = true;
        addLog(G, `Unlocked activity: ${act.name}`);
      }
    }
  }
}
