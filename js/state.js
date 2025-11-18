import { CONSTANTS, RACES } from './config.js';

const DEFAULT_STATE = {
    // Meta (Persists through runs)
    meta: {
        maxSkillLevels: {} // { skillId: maxLevelReached }
    },
    
    // Run State (Resets)
    hasStarted: false,
    isDead: false,
    deathCause: null, // Track specific cause of death
    isPaused: false,
    
    // Time
    ageInDays: 0,
    maxLifespanYears: 0,
    
    // Character
    race: 'human',
    traits: [],
    
    // Stats
    attributes: { STR: 10, VIT: 10, AGI: 10, SPI: 10, INT: 10, LUC: 10 },
    
    // Skills
    skills: {},
    
    // Resources
    resources: { stones: 0 },
    
    // Flags
    activeSkill: null 
};

export let gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));

export function resetState(fullReset = false) {
    // Preserve Meta Data
    const savedMeta = JSON.parse(JSON.stringify(gameState.meta));
    
    gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    
    if (!fullReset) {
        gameState.meta = savedMeta;
    }
}

export function loadGame() {
    const stored = localStorage.getItem('lje_cultivation_save');
    if (stored) {
        const loaded = JSON.parse(stored);
        // Merge loaded state with default to ensure new fields exist
        gameState = { ...DEFAULT_STATE, ...loaded };
        
        if (!gameState.meta) gameState.meta = { maxSkillLevels: {} };
        
        return true;
    }
    return false;
}

export function saveGame() {
    localStorage.setItem('lje_cultivation_save', JSON.stringify(gameState));
}

export function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    return gameState.isPaused;
}