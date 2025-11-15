import { tickSystems } from '../systems/tick.js';
import { saveNow } from './save.js';

let rafId = null;
let onTick = null;

export function runGameLoop(G) {
  let last = performance.now();
  const step = (t) => {
    const dtReal = (t - last) / 1000;
    last = t;
    const dt = dtReal * G.engine.tickSpeed;
    sim(G, dt);
    rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}

export function setOnTick(fn) { onTick = fn; }
export function setTickSpeed(G, rate) { G.engine.tickSpeed = Math.max(0.1, Math.min(100, rate)); }

function sim(G, dt) {
  const tickInterval = 1 / G.engine.tickHz;
  G.engine.timeScale += dt;
  while (G.engine.timeScale >= tickInterval) {
    tickOnce(G, tickInterval);
    G.engine.timeScale -= tickInterval;
  }
  if (onTick) onTick(dt);
}

function tickOnce(G, dt) {
  G.lastTickAt = Date.now();
  tickSystems(G, dt);
  // Autosave heartbeat small chance to reduce writes
  if (Math.random() < 0.02) saveNow(G);
}
