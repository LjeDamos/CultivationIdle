import { softcap } from '../core/utils.js';

export function skillXpPerTick(G, skillKey, baseXP) {
  const attrKey = G.skillDefs[skillKey].attr;
  const attrVal = G.player.attributes[attrKey] || 0;
  const layer1 = 1 + G.meta.layer1.xpMult;
  const traitXp = multFromTraits(G,'skillXp',1.0);
  const attrBonus = 1 + 0.05 * softcap(attrVal, 20, 0.6);
  const globalUp = 1 + (G.meta.layer2.upgrades.skillXp||0);
  const speedUp = 1 + (G.meta.layer2.upgrades.actSpeed||0);
  return baseXP * layer1 * traitXp * attrBonus * globalUp * speedUp;
}

export function selfMultiplier(skillLevel, gamma, k) {
  const capped = softcap(skillLevel, 50, 0.7);
  const base = 1 + gamma * capped;
  if (capped <= 50) return Math.pow(base, k);
  // After breakpoint, reduce curvature
  return Math.pow(base, Math.max(0.5, k*0.75));
}

export function calcLevel(G) {
  // Lp norm over skill levels
  const p = 1.5;
  const alpha = 0.5;
  let sum = 0;
  for (const [k, s] of Object.entries(G.player.skills)) {
    sum += Math.pow(s.level || 0, p);
  }
  return Math.max(1, Math.floor(alpha * Math.pow(sum, 1/p)));
}

export function rebirthReward(G) {
  // R = log(1 + sum s_i^q)
  const q = 1.25;
  let sum = 0;
  for (const s of Object.values(G.player.skills)) sum += Math.pow(s.level||0, q);
  return Math.log(1 + sum);
}

export function multFromTraits(G, key, base=1.0) {
  let m = base;
  for (const t of G.player.traits) {
    if (t.mult && t.mult[key]) m *= t.mult[key];
  }
  return m;
}
