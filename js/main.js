import { CONSTANTS, RACES, TRAITS, SKILLS } from './config.js';
import { gameState, resetState, saveGame, loadGame, togglePause } from './state.js';
import { tick } from './logic.js';
import { renderStats, renderSkills, logMessage, updatePauseButton } from './ui.js';

const els = {
    modal: document.getElementById('char-creation-modal'),
    deathModal: document.getElementById('death-modal'),
    gameContainer: document.getElementById('game-container'),
    raceGrid: document.getElementById('race-selection'),
    traitGrid: document.getElementById('trait-selection'),
    startBtn: document.getElementById('btn-start-life'),
    
    resetBtn: document.getElementById('btn-reset'),
    saveBtn: document.getElementById('btn-save'),
    pauseBtn: document.getElementById('btn-pause'),
    endLifeBtn: document.getElementById('btn-end-life'),
    exportBtn: document.getElementById('btn-export'),
    importBtn: document.getElementById('btn-import'),
    
    reincarnateBtn: document.getElementById('btn-reincarnate'),
    speedSlider: document.getElementById('debug-speed'),
    speedVal: document.getElementById('speed-val')
};

let availableTraits = [];
let selectedTraits = [];
let selectedRace = null;
let loopId = null;
let lastTime = 0;
let timeScale = 1.0;

let pendingMetaUpdates = {}; 

function init() {
    if(els.speedSlider) {
        els.speedSlider.oninput = (e) => {
            const x = parseInt(e.target.value);
            timeScale = Math.pow(100, x / 100);
            els.speedVal.textContent = timeScale.toFixed(1) + "x";
        };
    }

    els.saveBtn.onclick = () => { saveGame(); logMessage("Game Saved."); };
    
    els.resetBtn.onclick = () => { 
        if(confirm("Hard Reset? All progress will be lost.")) {
            localStorage.removeItem('lje_cultivation_save');
            location.reload();
        }
    };
    
    els.pauseBtn.onclick = () => {
        togglePause();
        updatePauseButton();
        logMessage(gameState.isPaused ? "Game Paused." : "Game Resumed.");
    };

    els.endLifeBtn.onclick = () => {
        if (!gameState.isDead && confirm("Are you sure you want to end this life prematurely?")) {
            gameState.isDead = true;
            gameState.deathCause = "Qi Deviation (Manual)"; // Set manual cause
            logMessage("You have ended your life prematurely.", "important");
            handleDeath();
        }
    };

    els.exportBtn.onclick = exportSave;
    els.importBtn.onclick = importSave;
    els.reincarnateBtn.onclick = prestige;

    const hasSave = loadGame();

    if (hasSave && gameState.hasStarted && !gameState.isDead) {
        els.modal.classList.add('hidden');
        els.deathModal.classList.add('hidden');
        updatePauseButton();
        startGameLoop();
        logMessage("Welcome back, Cultivator.");
    } else {
        setupCharCreation();
    }
}

function setupCharCreation() {
    els.modal.classList.remove('hidden');
    els.gameContainer.classList.add('hidden');
    els.deathModal.classList.add('hidden');
    
    els.raceGrid.innerHTML = '';
    for (let [key, race] of Object.entries(RACES)) {
        const div = document.createElement('div');
        div.className = 'select-opt';
        div.innerHTML = `<strong>${race.name}</strong>`;
        div.onclick = () => selectRace(key, div);
        els.raceGrid.appendChild(div);
    }

    availableTraits = TRAITS.sort(() => 0.5 - Math.random()).slice(0, 9);
    selectedTraits = [];
    els.traitGrid.innerHTML = '';
    
    availableTraits.forEach(trait => {
        const div = document.createElement('div');
        div.className = 'select-opt';
        div.innerHTML = `<strong>${trait.name}</strong><br><small>${trait.desc}</small>`;
        div.onclick = () => toggleTrait(trait, div);
        els.traitGrid.appendChild(div);
    });
    
    els.startBtn.onclick = finalizeCreation;
    els.startBtn.disabled = true;
}

function selectRace(key, element) {
    selectedRace = key;
    document.querySelectorAll('#race-selection .select-opt').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('race-desc').textContent = RACES[key].desc;
    checkStartCondition();
}

function toggleTrait(trait, element) {
    if (selectedTraits.includes(trait.id)) {
        selectedTraits = selectedTraits.filter(t => t !== trait.id);
        element.classList.remove('selected');
    } else {
        if (selectedTraits.length < 3) {
            selectedTraits.push(trait.id);
            element.classList.add('selected');
        }
    }
    checkStartCondition();
}

function checkStartCondition() {
    els.startBtn.disabled = !(selectedRace && selectedTraits.length === 3);
}

function finalizeCreation() {
    gameState.race = selectedRace;
    gameState.traits = selectedTraits;
    
    const raceData = RACES[selectedRace];
    for(let key in gameState.attributes) {
        gameState.attributes[key] = 10 * raceData.attrMods[key];
    }

    gameState.hasStarted = true;
    gameState.isDead = false;
    gameState.deathCause = null;
    gameState.isPaused = false;
    gameState.ageInDays = 14 * 365; 
    
    els.modal.classList.add('hidden');
    updatePauseButton();
    saveGame();
    
    startGameLoop();
    logMessage(`You start your journey as a ${raceData.name} at the age of 14.`);
}

function startGameLoop() {
    els.gameContainer.classList.remove('hidden');
    lastTime = performance.now();
    loopId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (!gameState.isDead) {
        if (!gameState.isPaused) {
            tick(dt * timeScale);
            if (Math.random() < 0.001) saveGame();
        }
        renderStats();
        renderSkills();
        requestAnimationFrame(gameLoop);
    } else {
        if (els.deathModal.classList.contains('hidden')) {
            handleDeath();
        }
        renderStats();
    }
}

function handleDeath() {
    saveGame();
    gameState.activeSkill = null; 
    
    pendingMetaUpdates = {};
    // Display Cause
    let summaryHtml = `<h3 style="color:var(--danger)">Cause of Death: ${gameState.deathCause || "Unknown"}</h3>`;
    summaryHtml += `<p>You lived for ${Math.floor(gameState.ageInDays/365)} years.</p>`;
    summaryHtml += `<h3>Skill Milestones</h3><ul style="text-align:left; font-size:0.9rem;">`;
    
    let improvements = 0;
    
    for(let [skillId, skillData] of Object.entries(gameState.skills)) {
        const oldMax = gameState.meta.maxSkillLevels[skillId] || 0;
        
        if (skillData.level > oldMax) {
            pendingMetaUpdates[skillId] = skillData.level;
            
            const oldMult = (1 + (oldMax * 0.1)).toFixed(1);
            const newMult = (1 + (skillData.level * 0.1)).toFixed(1);
            
            summaryHtml += `
                <li style="margin-bottom:4px;">
                    <strong>${SKILLS[skillId].name}</strong>: Lv ${oldMax} -> <span style="color:var(--accent)">${skillData.level}</span>
                    <br/>
                    <span style="color:#aaa; font-size:0.85em; margin-left:10px;">XP Bonus: x${oldMult} -> <span style="color:var(--accent)">x${newMult}</span></span>
                </li>`;
            improvements++;
        }
    }
    
    if (improvements === 0) {
        summaryHtml += `<li>No new skill max levels reached.</li>`;
    }
    summaryHtml += `</ul>`;
    
    els.deathModal.classList.remove('hidden');
    document.getElementById('death-stats').innerHTML = summaryHtml;
}

function prestige() {
    for (let [skillId, newLvl] of Object.entries(pendingMetaUpdates)) {
        gameState.meta.maxSkillLevels[skillId] = newLvl;
    }
    resetState(false); 
    setupCharCreation();
}

function exportSave() {
    saveGame();
    const data = btoa(localStorage.getItem('lje_cultivation_save'));
    navigator.clipboard.writeText(data).then(() => {
        logMessage("Save data copied to clipboard.", "important");
        alert("Save string copied to clipboard!");
    }).catch(err => {
        console.error(err);
        prompt("Copy this string:", data);
    });
}

function importSave() {
    const str = prompt("Paste your save string here:");
    if (!str) return;
    try {
        const json = atob(str);
        const data = JSON.parse(json);
        if (data && data.attributes) {
            localStorage.setItem('lje_cultivation_save', json);
            location.reload();
        } else {
            alert("Invalid Save Data");
        }
    } catch (e) {
        alert("Error importing save: " + e.message);
    }
}

window.onload = init;