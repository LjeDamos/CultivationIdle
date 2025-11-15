import { ACTIVITIES } from '../data/activities.js';
import { SKILLS } from '../data/skills.js';
import { skillXpPerTick, selfMultiplier, calcLevel, rebirthReward } from './formulas.js';
import { addLog } from './logs.js';
import { recommendResetIfAny, performReincarnateIfAny, checkUnlocks } from './progression.js';

export function tickSystems(G, dt) {
  // Age increases
  G.player.age += dt * 0.02; // seconds -> years pacing

  // Activities
  if (G.player.activities.active) {
    const act = ACTIVITIES[G.player.activities.active];
    if (act) {
      applyActivity(G, act, dt);
    }
  }

  // Skill passive soft idle: tiny XP bleed per second to all unlocked skills
  for (const [k, def] of Object.entries(SKILLS)) {
    const s = G.player.skills[k];
    const xp = 0.02 * skillXpPerTick(G, k, def.baseXP);
    s.xp += xp * dt;
    while (s.xp >= needXpFor(s.level)) {
      s.xp -= needXpFor(s.level);
      s.level++;
      addLog(G, `Skill up: ${def.name} ${s.level}`);
    }
  }

  // Yield from active activity also grants XP strongly in its skill
  // Level calc
  const newLv = calcLevel(G);
  if (newLv !== G.player.level) {
    G.player.level = newLv;
  }
  if (G.player.level >= 3 && !G.unlocks.automation) {
    G.unlocks.automation = true;
    addLog(G, 'Automation tab unlocked.');
  }
  if (G.player.level >= 10 && !G.unlocks.ascension) {
    G.unlocks.ascension = true;
    addLog(G, 'Ascension tab unlocked.');
  }

  // Death by age
  if (G.player.age >= G.player.lifespan || G.flags.forceReincarnate) {
    G.flags.forceReincarnate = false;
    reincarnate(G);
  }

  // Reset suggestion ping
  recommendResetIfAny(G);

  // Check gating (activities/tabs)
  checkUnlocks(G);
}

function needXpFor(level) {
  return 10 + level * 10 * (1 + 0.1 * Math.floor(level/10));
}

function applyActivity(G, act, dt) {
  const skillKey = act.skill;
  const sDef = G.skillDefs[skillKey];
  const s = G.player.skills[skillKey];

  // Activity yield
  const y = act.yield(G, dt * selfMultiplier(s.level, sDef.gamma, sDef.k));
  if (y.qi) G.player.resources.qi += y.qi;
  if (y.insight) G.player.resources.insight += y.insight;
  if (y.herb) G.player.resources.materials.herb += y.herb;
  if (y.ore) G.player.resources.materials.ore += y.ore;
  if (y.beast) G.player.resources.materials.beast += y.beast;
  if (y.stones) G.player.resources.stones += y.stones;

  // XP gain
  const base = sDef.baseXP;
  const xp = 1.5 * skillXpPerTick(G, skillKey, base);
  s.xp += xp * dt;
  while (s.xp >= needXpFor(s.level)) {
    s.xp -= needXpFor(s.level);
    s.level++;
    if (s.level > (G.player.best.maxSkillLevels[skillKey]||0)) {
      G.player.best.maxSkillLevels[skillKey] = s.level;
    }
    addLog(G, `Skill up: ${sDef.name} ${s.level}`);
  }
}

function reincarnate(G) {
  const reward = rebirthReward(G);
  G.meta.layer1.xpMult += reward * 0.02; // small permanent
  G.meta.layer1.points += reward;

  addLog(G, `Life ended at age ${G.player.age.toFixed(1)}. Layer 1 XP +${(reward*2).toFixed(2)}%.`);
  // Reset life state, keep meta & trait pool expansion
  const keepTraits = [];
  // Let player keep chosen traits only as selection options, not equipped
  const pool = G.player.traitPool;

  // Reset player
  G.player.age = 16.0;
  G.player.lifespan = 60.0 + 0.1 * (G.player.attributes.VIT||0);
  G.player.skills = Object.fromEntries(Object.keys(G.player.skills).map(k=>[k,{level:0,xp:0}]));
  G.player.level = 1;
  G.player.traits = [];
  G.player.resources = { qi:0, stones:0, materials:{herb:0,ore:0,beast:0}, insight:0, reputation:0 };
  G.player.activities = { active:null, queue:[], unlocked:{meditate:true,gather:true} };
  G.unlocks.automation = false;
  G.unlocks.ascension = false;
  G.player.messageLog = [];
  G.player.traitPool = pool; // expanded pool persists
  addLog(G, 'Reincarnated. Choose race and traits for a new life.');
}
