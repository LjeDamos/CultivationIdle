import { gameState, saveGame } from './state.js';
import { CONSTANTS, SKILLS, RACES, TRAITS, ATTRIBUTES } from './config.js';
import { logMessage } from './ui.js';

// Core multiplier calculation used by game loop
export function getEffectiveMultipliers() {
    let mods = {
        xpMult: 1.0,
        attrMults: { STR: 1, VIT: 1, AGI: 1, SPI: 1, INT: 1, LUC: 1 },
        lifespanFlat: 0,
        skillMults: {},
        actionSpeed: 1.0
    };

    // Apply Race (Multiplicative Base)
    const raceData = RACES[gameState.race];
    if (raceData) {
        for (let k in raceData.attrMods) {
            mods.attrMults[k] *= raceData.attrMods[k];
        }
    }

    // Apply Traits (Additive/Modification to the base)
    if (gameState.traits && gameState.traits.length > 0) {
        gameState.traits.forEach(traitId => {
            const traitDef = TRAITS.find(t => t.id === traitId);
            if (traitDef && traitDef.effect) {
                traitDef.effect(mods);
            }
        });
    }
    
    return mods;
}

// --- Simulation Helpers for Tooltips ---

function getTraitContributors(checkFn) {
    const contributors = [];
    
    if (!gameState.traits) return contributors;

    let mockState = {
        xpMult: 1.0,
        attrMults: { STR: 1, VIT: 1, AGI: 1, SPI: 1, INT: 1, LUC: 1 },
        lifespanFlat: 0,
        skillMults: {},
        actionSpeed: 1.0
    };
    
    const raceData = RACES[gameState.race];
    if (raceData) {
        for (let k in raceData.attrMods) {
            mockState.attrMults[k] *= raceData.attrMods[k];
        }
    }

    gameState.traits.forEach(traitId => {
        const trait = TRAITS.find(t => t.id === traitId);
        if (!trait) return;

        const before = checkFn(mockState);
        trait.effect(mockState);
        const after = checkFn(mockState);

        if (Math.abs(after - before) > 0.0001) {
            contributors.push({ name: trait.name, val: after - before });
        }
    });

    return contributors;
}

export function getAttributeBreakdown(key) {
    const raceData = RACES[gameState.race];
    const raceMod = raceData.attrMods[key] || 1;
    
    // 1. Base (Race Adjusted)
    const base = 10 * raceMod;
    
    // 2. Trained
    const currentRaw = gameState.attributes[key];
    const trained = Math.max(0, currentRaw - base);
    
    // 3. Effective Multiplier
    const allMods = getEffectiveMultipliers();
    const totalMult = allMods.attrMults[key];
    
    const traitSources = getTraitContributors(s => s.attrMults[key]);
    
    const traitOnlyMult = totalMult / raceMod;
    
    const effective = currentRaw * traitOnlyMult;
    
    return {
        desc: ATTRIBUTES[key].desc,
        base,
        raceName: raceData.name,
        trained,
        totalMult,
        traitSources, 
        effective
    };
}

export function getLifespanBreakdown() {
    const raceData = RACES[gameState.race];
    const base = raceData.baseLifespan;
    
    const allMods = getEffectiveMultipliers();
    
    // VIT Calculation
    const startVit = 10 * raceData.attrMods.VIT;
    const currentVit = gameState.attributes.VIT;
    const trainedVit = Math.max(0, currentVit - startVit);
    
    // Vitality Efficiency sources
    const vitEffSources = getTraitContributors(s => s.attrMults.VIT);
    
    const vitBonus = trainedVit * 0.5 * allMods.attrMults.VIT;
    
    // Flat Bonuses
    const flatSources = getTraitContributors(s => s.lifespanFlat);
    
    const total = base + vitBonus + allMods.lifespanFlat;
    
    return {
        base,
        raceName: raceData.name,
        vitBonus,
        vitEffSources,
        flatSources, 
        total
    };
}

export function calculateLifespan() {
    return getLifespanBreakdown().total;
}

export function getSkillXpReq(level) {
    return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function getSkillPrestigeMult(skillId) {
    const maxLvl = gameState.meta.maxSkillLevels[skillId] || 0;
    if (maxLvl <= 1) return 1.0;
    return 1 + (maxLvl * 0.1); 
}

export function tick(dtSeconds) {
    if (!gameState.hasStarted || gameState.isDead) return;

    const daysPassed = CONSTANTS.DAYS_PER_SEC * dtSeconds;
    gameState.ageInDays += daysPassed;

    const limit = calculateLifespan();
    gameState.maxLifespanYears = limit;

    // Death Check
    if ((gameState.ageInDays / 365) >= limit) {
        gameState.isDead = true;
        gameState.deathCause = "Old Age"; // Default cause
        gameState.activeSkill = null;
        logMessage("You have died of Old Age.", "important");
        return;
    }

    if (gameState.activeSkill) {
        processSkill(gameState.activeSkill, dtSeconds);
    }
}

function processSkill(skillId, dt) {
    if (!gameState.skills[skillId]) {
        gameState.skills[skillId] = { level: 1, xp: 0, maxXp: 100 };
    }

    const skill = gameState.skills[skillId];
    const skillConfig = SKILLS[skillId];
    const mods = getEffectiveMultipliers();
    const prestigeMult = getSkillPrestigeMult(skillId);
    const traitSkillMult = (mods.skillMults[skillId] || 0) + 1.0;

    const raceData = RACES[gameState.race];
    const raceMod = raceData.attrMods[skillConfig.attr] || 1;
    
    const traitMod = mods.attrMults[skillConfig.attr] / raceMod;
    const effectiveAttr = (gameState.attributes[skillConfig.attr] || 1) * traitMod;

    const xpGain = 10 * dt * (1 + effectiveAttr * 0.05) * mods.xpMult * prestigeMult * traitSkillMult; 

    skill.xp += xpGain;

    if (skill.xp >= skill.maxXp) {
        levelUpSkill(skillId);
    }
}

function levelUpSkill(skillId) {
    const skill = gameState.skills[skillId];
    skill.level++;
    skill.xp -= skill.maxXp;
    skill.maxXp = getSkillXpReq(skill.level);
    
    const attrKey = SKILLS[skillId].attr;
    gameState.attributes[attrKey] += 0.5; 
    
    logMessage(`Skill ${SKILLS[skillId].name} leveled up!`);
}

export function getCharacterLevel() {
    let sum = 0;
    Object.values(gameState.skills).forEach(s => {
        sum += Math.pow(s.level, CONSTANTS.LEVEL_P_VAL);
    });
    if (sum === 0) return 1;
    return Math.floor(CONSTANTS.LEVEL_ALPHA * Math.pow(sum, 1/CONSTANTS.LEVEL_P_VAL)) || 1;
}