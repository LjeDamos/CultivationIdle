window.Celestial = window.Celestial || {};
Celestial.RACES = {
  human: {
    name:'Human',
    mods:{ STR:0, VIT:0, AGI:0, SPIRIT:0, INT:0, LUCK:0 },
    perks:{ qiRate:1.0, insightRate:1.0 },
    tooltip:'Balanced and adaptable; ideal for first runs.'
  },
  elf: {
    name:'Elf',
    mods:{ SPIRIT:+1, AGI:+1 },
    perks:{ qiRate:1.1, breakthroughEase:1.05 },
    tooltip:'Attuned to Qi; faster cultivation and nimble.'
  },
  demonkin: {
    name:'Demonkin',
    mods:{ STR:+2, VIT:+1, LUCK:-1 },
    perks:{ combatYield:1.2, riskReward:1.1 },
    tooltip:'Powerful physique; thrives in challenges.'
  },
  spiritfolk: {
    name:'Spiritfolk',
    mods:{ SPIRIT:+2, STR:-1 },
    perks:{ qiRate:1.2, meditationSpeed:1.15 },
    tooltip:'Mystic lineage; excels at meditation.'
  }
};
