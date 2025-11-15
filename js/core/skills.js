import { State, gainResource } from '../core/state.js';
import { CONSTANTS, SKILLS } from '../data/config.js';

function skillXPPerTick(skillId) {
  const sMeta = SKILLS.find(s => s.id === skillId);
  const inst = State.skills[skillId];
  const b = sMeta.baseXP;
  const m = sMeta.mults;
  const globalTrait = State.run.traitsChosen?.some(t => t.id === 'quickLearner') ? 1.10 : 1.0;
  const attrSpirit = 1.0 * (State.character.attributes.SPIRIT || 1);
  // XP_s = b_s * (1 + M_skill) * (1 + A_attr) * ΠU (simplified)
  return b * m.skill * globalTrait * Math.max(1, Math.sqrt(attrSpirit)) * m.upgrades;
}

export function updateSkills(dt) {
  // Active meditation button adds “instant” ticks; here we do passive trickle
  const med = State.skills.meditation;
  if (!med.locked) {
    const xpGain = skillXPPerTick('meditation') * CONSTANTS.MEDITATE_XP_PER_TICK * (dt * CONSTANTS.TICKS_PER_SEC);
    med.xp += xpGain;
    // Each passive tick also grants some Qi
    gainResource('qi', CONSTANTS.MEDITATE_QI_PER_TICK * (dt * CONSTANTS.TICKS_PER_SEC));
    // Level up thresholds: e.g., level^2 * 10
    const nextReq = (med.level + 1) ** 2 * 10;
    if (med.xp >= nextReq) {
      med.level += 1;
      med.xp -= nextReq;
    }
  }

  // Reveal martial arts later
  const martial = State.skills.martial;
  if (martial && State.character.level >= (findSkill('martial')?.unlockLevel || 4)) {
    martial.locked = false;
  }
}

function findSkill(id) {
  return SKILLS.find(s => s.id === id);
}

export function doMeditateClick() {
  const mul = 1 + (State.run.traitsChosen?.some(t => t.id === 'qiConduit') ? 0.10 : 0);
  const qi = CONSTANTS.MEDITATE_QI_PER_TICK * 4 * mul; // click is worth ~4 ticks
  const xp = skillXPPerTick('meditation') * CONSTANTS.MEDITATE_XP_PER_TICK * 4 * mul;
  State.resources.qi += qi;
  State.skills.meditation.xp += xp;
}

export function useStoneToQi() {
  if (State.resources.stones <= 0) return;
  State.resources.stones -= 1;
  State.resources.qi += CONSTANTS.STONE_TO_QI;
}

export function recalcCharacterLevel() {
  // Level = floor(alpha * (sum s_i^p)^(1/p))
  const p = CONSTANTS.LEVEL_P;
  const alpha = CONSTANTS.LEVEL_ALPHA;
  let sum = 0;
  for (const k of Object.keys(State.skills)) {
    const s = State.skills[k];
    sum += Math.pow(s.level, p);
  }
  const lp = Math.pow(sum, 1 / p);
  const newLevel = Math.max(1, Math.floor(alpha * lp) || 1);
  State.character.level = newLevel;
}
