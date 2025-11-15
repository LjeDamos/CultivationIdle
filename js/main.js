import { newGameState, migrateState } from './core/state.js';
import { runGameLoop, setTickSpeed, setOnTick } from './core/engine.js';
import { saveNow, autoSaveInit, exportSave, importSave } from './core/save.js';
import { buildUI, switchTab, ui } from './ui/ui.js';
import { updateOverview } from './ui/views/overview.js';
import { updateActivities } from './ui/views/activities.js';
import { updateSkills } from './ui/views/skills.js';
import { updateTraits } from './ui/views/traits.js';
import { updateAutomation } from './ui/views/automation.js';
import { updateAscension } from './ui/views/ascension.js';
import { updateAchievements } from './ui/views/achievements.js';
import { updateLog } from './ui/views/log.js';
import { updateSettings } from './ui/views/settings.js';
import { recommendResetIfAny } from './systems/progression.js';
import { offlineProgress } from './systems/offline.js';

let G = null;

function init() {
  const saved = localStorage.getItem('celestial.save');
  if (saved) {
    try {
      G = migrateState(JSON.parse(atob(saved)));
    } catch {
      G = newGameState();
    }
  } else {
    G = newGameState();
  }

  offlineProgress(G);

  buildUI(G);
  wireEvents();
  renderAll();

  autoSaveInit(G);
  runGameLoop(G);
}

function wireEvents() {
  // Tabs
  document.querySelectorAll('#tabs .tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (btn.classList.contains('locked')) return;
      switchTab(btn.dataset.tab);
      renderAll();
    });
  });

  // Debug tick slider (logarithmic 0.1x..100x)
  const sl = document.getElementById('debug-tick');
  const slv = document.getElementById('debug-tick-value');
  const toRate = t => Math.pow(10, -1 + t*3); // 0..1 -> 0.1..100
  const fromRate = r => (Math.log10(r) + 1) / 3;
  sl.value = fromRate(G.engine.tickSpeed).toFixed(3);
  slv.textContent = `${G.engine.tickSpeed.toFixed(2)}x`;
  sl.addEventListener('input', ()=>{
    const rate = toRate(parseFloat(sl.value));
    setTickSpeed(G, rate);
    slv.textContent = `${rate.toFixed(2)}x`;
  });

  // Save / export / import
  document.getElementById('btn-save').addEventListener('click', ()=>saveNow(G));
  document.getElementById('btn-export').addEventListener('click', ()=>{
    exportSave(G);
  });
  document.getElementById('btn-import').addEventListener('click', async ()=>{
    const s = prompt('Paste save string:');
    if (!s) return;
    const ok = importSave(s);
    if (ok) location.reload();
    else alert('Invalid save.');
  });

  document.getElementById('btn-reset-life').addEventListener('click', ()=>{
    if (confirm('End current life and reincarnate?')) {
      G.flags.forceReincarnate = true;
    }
  });

  // Per-tick render throttling
  let accum = 0;
  setOnTick((dt)=>{
    accum += dt;
    if (accum > 0.25) { // UI refresh 4Hz
      renderAll();
      accum = 0;
    }
  });
}

function renderAll() {
  updateTopbar(G);
  const activeTab = document.querySelector('.view.active')?.id || 'tab-overview';
  switch (activeTab) {
    case 'tab-overview': updateOverview(G); break;
    case 'tab-activities': updateActivities(G); break;
    case 'tab-skills': updateSkills(G); break;
    case 'tab-traits': updateTraits(G); break;
    case 'tab-automation': updateAutomation(G); break;
    case 'tab-ascension': updateAscension(G); break;
    case 'tab-achievements': updateAchievements(G); break;
    case 'tab-log': updateLog(G); break;
    case 'tab-settings': updateSettings(G); break;
  }
}

function updateTopbar(G) {
  document.getElementById('status-level').textContent = `Lvl ${G.player.level}`;
  document.getElementById('status-age').textContent = `Age ${G.player.age.toFixed(1)}`;
  document.getElementById('status-lifespan').textContent = `Lifespan ${G.player.lifespan.toFixed(1)}`;
  document.getElementById('status-q i').textContent = `Qi ${Math.floor(G.player.resources.qi)}`;
  document.getElementById('status-stones').textContent = `Stones ${Math.floor(G.player.resources.stones)}`;

  // Unlock tabs based on flags
  ui.unlockTab('tab-automation', G.unlocks.automation);
  ui.unlockTab('tab-ascension', G.unlocks.ascension);
}

init();
