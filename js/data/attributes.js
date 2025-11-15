window.Celestial = window.Celestial || {};
Celestial.ATTRIBUTES = {
  STR: { name:'Strength', tooltip:'Increases physical power, carrying capacity, and some combat yields.' },
  VIT: { name:'Vitality', tooltip:'Increases health, regeneration, and extends lifespan.' },
  AGI: { name:'Agility', tooltip:'Increases action speed and evasion-like effects.' },
  SPIRIT: { name:'Spirit', tooltip:'Boosts cultivation rate, Qi regeneration, and mystical scaling.' },
  INT: { name:'Intellect', tooltip:'Boosts research speed, knowledge caps, and formula unlocks.' },
  LUCK: { name:'Luck', tooltip:'Increases rare event chance and rare drop multipliers.' },
};

Celestial.attributeTooltips = function() {
  const out = {};
  for (const [k,v] of Object.entries(Celestial.ATTRIBUTES)) out[k] = v.tooltip;
  return out;
};
