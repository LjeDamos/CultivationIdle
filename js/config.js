export const CONSTANTS = {
    TICK_RATE_MS: 1000 / 10, 
    DAYS_PER_SEC: 6, 
    LEVEL_P_VAL: 1.5,
    LEVEL_ALPHA: 0.5
};

export const ATTRIBUTES = {
    STR: { name: "Strength", desc: "Physical power and carrying capacity." },
    VIT: { name: "Vitality", desc: "Health and lifespan." },
    AGI: { name: "Agility", desc: "Action speed." },
    SPI: { name: "Spirit", desc: "Cultivation rate and Qi." },
    INT: { name: "Intelligence", desc: "Research and formulas." },
    LUC: { name: "Luck", desc: "Rare events." }
};

export const RACES = {
    human: { 
        name: "Human", 
        desc: "Balanced growth. Good for beginners.", 
        baseLifespan: 60,
        attrMods: { STR: 1.0, VIT: 1.0, AGI: 1.0, SPI: 1.0, INT: 1.0, LUC: 1.0 } 
    },
    elf: { 
        name: "Elf", 
        desc: "High Spirit and Agility. Fragile.", 
        baseLifespan: 170,
        attrMods: { STR: 0.8, VIT: 0.9, AGI: 1.2, SPI: 1.3, INT: 1.1, LUC: 1.0 } 
    },
    demonkin: { 
        name: "Demonkin", 
        desc: "Strong and tough. Combat focused.", 
        baseLifespan: 80,
        attrMods: { STR: 1.4, VIT: 1.3, AGI: 1.0, SPI: 0.8, INT: 0.9, LUC: 1.0 } 
    },
    spiritfolk: { 
        name: "Spiritfolk", 
        desc: "Pure Qi beings. Weak bodies.", 
        baseLifespan: 130,
        attrMods: { STR: 0.6, VIT: 0.7, AGI: 1.0, SPI: 1.6, INT: 1.2, LUC: 1.0 } 
    },
    dragonkin: { 
        name: "Dragonkin", 
        desc: "Late bloomers. High scaling.", 
        baseLifespan: 80,
        attrMods: { STR: 1.2, VIT: 1.2, AGI: 1.1, SPI: 1.1, INT: 1.1, LUC: 1.2 } 
    }
};

export const TRAITS = [
    { id: "quick_learner", name: "Quick Learner", desc: "+10% Global XP", effect: (s) => s.xpMult += 0.1 },
    { id: "iron_body", name: "Iron Body", desc: "+20% VIT Effect", effect: (s) => s.attrMults.VIT += 0.2 },
    { id: "qi_conduit", name: "Qi Conduit", desc: "+20% SPI Effect", effect: (s) => s.attrMults.SPI += 0.2 },
    { id: "agile_mind", name: "Agile Mind", desc: "+20% INT Effect", effect: (s) => s.attrMults.INT += 0.2 },
    { id: "lucky_star", name: "Lucky Star", desc: "+20% LUC Effect", effect: (s) => s.attrMults.LUC += 0.2 },
    { id: "hard_worker", name: "Hard Worker", desc: "Action speed +10%", effect: (s) => s.actionSpeed += 0.1 },
    { id: "long_lived", name: "Long Lived", desc: "+20 Years Lifespan", effect: (s) => s.lifespanFlat += 20 },
    { id: "natural_tao", name: "Natural Tao", desc: "Meditation +30%", effect: (s) => s.skillMults['meditation'] = (s.skillMults['meditation'] || 0) + 0.3 },
    { id: "merchant", name: "Merchant", desc: "Trading +30%", effect: (s) => s.skillMults['trading'] = (s.skillMults['trading'] || 0) + 0.3 }
];

export const SKILLS = {
    meditation: { name: "Meditation", attr: "SPI", desc: "Gather Qi from the surroundings." },
    body_training: { name: "Body Training", attr: "STR", desc: "Strengthen the muscles." },
    running: { name: "Running", attr: "AGI", desc: "Improve speed and stamina." },
    study: { name: "Study", attr: "INT", desc: "Analyze the world." },
    alchemy: { name: "Alchemy", attr: "INT", desc: "Brew elixirs (Requires Herbs)." },
    mining: { name: "Mining", attr: "VIT", desc: "Gather ores. Builds vitality." }
};