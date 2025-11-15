import { tickSystems } from './tick.js';

export function offlineProgress(G) {
  const now = Date.now();
  const deltaMs = now - (G.lastTickAt||now);
  if (deltaMs <= 0) return;
  const seconds = Math.min(deltaMs/1000, 8*3600); // Cap offline progress to 8 hours
  const step = 0.05;
  let t = 0;
  while (t < seconds) {
    tickSystems(G, step);
    t += step;
  }
}
