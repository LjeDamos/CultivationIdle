export const CONSTANTS = {
    TICKS_PER_SEC: 20,
    AUTOSAVE_SEC_DEFAULT: 15,
    LEVEL_P: 1.5,
    LEVEL_ALPHA: 0.5,
    LIFESPAN_BASE_YEARS: 60,
    AGE_START: 16,
    MEDITATE_QI_PER_TICK: 0.2,
    MEDITATE_XP_PER_TICK: 0.15,
    STONE_TO_QI: 50
  };
  
  // Minimal early slice; extend freely
  export const SKILLS = [
    {
      id: 'meditation',
      name: 'Meditation',
      baseXP: 1.0,
      desc: 'Focus to gather Qi and accelerate breakthroughs.',
      // Example multiplicative categories; extend as systems unlock
      mults: {
        skill: 1.0,   // Layer 1, trait bonuses etc.
        attr: 1.0,    // SPIRIT links
        upgrades: 1.0 // purchased upgrades
      }
    },
    {
      id: 'martial',
      name: 'Martial Arts',
      baseXP: 0.8,
      desc: 'Train your body and techniques for combat.',
      mults: { skill: 1.0, attr: 1.0, upgrades: 1.0 },
      locked: true, // appears later
      unlockLevel: 4
    }
  ];
  
  export const RACES = [
    { id: 'human', name: 'Human', desc: 'Balanced growth and flexible paths.', mods: { STR:1, VIT:1, AGI:1, SPIRIT:1, INT:1, LUCK:1 } },
    { id: 'elf', name: 'Elf', desc: 'SPIRIT and AGI focused; faster cultivation.', mods: { STR:0.9, VIT:0.9, AGI:1.1, SPIRIT:1.1, INT:1, LUCK:1 } },
    { id: 'demonkin', name: 'Demonkin', desc: 'STR and VIT for aggressive routes.', mods: { STR:1.1, VIT:1.1, AGI:1, SPIRIT:0.95, INT:1, LUCK:1 } }
  ];
  
  export const TRAITS_POOL = [
    { id: 'quickLearner', name: 'Quick Learner', desc: '+10% global skill XP.', effects: { xpGlobal: 0.10 } },
    { id: 'qiConduit', name: 'Qi Conduit', desc: '+10% SPIRIT scaling and Qi gen.', effects: { spiritMult: 0.10, qiGain: 0.10 } },
    { id: 'ironBody', name: 'Iron Body', desc: '+10% VIT scaling and mitigation.', effects: { vitMult: 0.10 } },
    { id: 'artisan', name: 'Artisan', desc: '+10% crafting output (future).', effects: { craftOut: 0.10 } },
    { id: 'strategist', name: 'Strategist', desc: '+10% formation/leadership (future).', effects: { formation: 0.10 } },
    { id: 'lucky', name: 'Lucky', desc: 'Increased rare event rates (future).', effects: { luck: 0.10 } },
    { id: 'researcher', name: 'Researcher', desc: '+10% research speed (future).', effects: { research: 0.10 } },
    { id: 'merchant', name: 'Merchant', desc: 'Better trade margins (future).', effects: { trade: 0.10 } },
    { id: 'inscriber', name: 'Inscriber', desc: 'Inscription efficacy (future).', effects: { inscription: 0.10 } }
  ];
  