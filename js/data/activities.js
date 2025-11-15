window.Celestial = window.Celestial || {};
Celestial.ACTIVITIES = {
  meditate: {
    id:'meditate', name:'Meditate', skill:'Meditation', 
    yield:function(G,dt){ return { qi: baseQiGain(G,dt) }; },
    tooltip:'Convert time into Qi while training Meditation.'
  },
  gather: {
    id:'gather', name:'Gather', skill:'Gathering',
    yield:function(G,dt){ return randomGather(G,dt); },
    tooltip:'Collect herbs/ores/beast parts while training Gathering.'
  },
  research: {
    id:'research', name:'Research', skill:'Research', gate:{ level:5 },
    yield:function(G,dt){ return { insight: baseInsightGain(G,dt) }; },
    tooltip:'Study to generate Insight for upgrades (unlocks at level 5).'
  },
  craft: {
    id:'craft', name:'Craft', skill:'Crafting', gate:{ insight:50 },
    yield:function(G,dt){ return craftTick(G,dt); },
    tooltip:'Use materials to craft tools and unlock efficiency jumps.'
  },
  train: {
    id:'train', name:'Train Martial', skill:'Martial Arts', gate:{ qi:200 },
    yield:function(G,dt){ return { stones: baseStonesGain(G,dt*0.1) }; },
    tooltip:'Hone body; small chance to condense Stones at higher mastery.'
  },
};

function traitMult(G, key, def=1.0) {
  let m = def;
  for (const t of G.player.traits) {
    if (t.mult && t.mult[key]) m *= t.mult[key];
  }
  return m;
}

function baseQiGain(G,dt) {
  const base = 2.0;
  const spirit = G.player.attributes.SPIRIT || 0;
  const skill = G.player.skills.meditation.level || 0;
  const mult = 1.0 * traitMult(G,'meditation',1.0) * traitMult(G,'qiGain',1.0) * (1 + 0.03*spirit) * (1 + 0.01*skill);
  return base * mult * dt;
}

function baseInsightGain(G,dt) {
  const base = 0.6;
  const intellect = G.player.attributes.INT || 0;
  const skill = G.player.skills.research.level || 0;
  const mult = traitMult(G,'research',1.0) * (1 + 0.04*intellect) * (1 + 0.01*skill);
  return base * mult * dt;
}

function baseStonesGain(G,dt) {
  const base = 0.02;
  return base * traitMult(G,'stones',1.0) * dt;
}

function craftTick(G,dt) {
  if (G.player.resources.materials.herb > 0 && G.player.resources.materials.ore > 0) {
    const use = Math.min(1*dt, G.player.resources.materials.herb, G.player.resources.materials.ore);
    G.player.resources.materials.herb -= use;
    G.player.resources.materials.ore -= use;
    G.meta.layer2.upgrades.actSpeed = (G.meta.layer2.upgrades.actSpeed||0) + 0.0005*use;
    return { };
  }
  return { };
}

function randomGather(G,dt) {
  const roll = Math.random();
  const amt = (0.5 + 0.01*(G.player.skills.gathering.level||0)) * (1 + 0.02*(G.player.attributes.AGI||0)) * dt;
  if (roll < 0.5) { G.player.resources.materials.herb += amt; return { herb: amt }; }
  else if (roll < 0.85) { G.player.resources.materials.ore += amt; return { ore: amt }; }
}
