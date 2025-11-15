import { State } from './core/state.js';
import { loadOrNew, saveNow, exportSave, importSave, applyOfflineProgress } from './core/save.js';
import { runLoop } from './core/tick.js';
import { bindUI, updatePanels, updateOverview, initialRaceFlowIfNeeded, renderLog } from './ui/ui.js';

loadOrNew();
applyOfflineProgress();
bindUI();
updatePanels();
updateOverview();
renderLog();
initialRaceFlowIfNeeded();

// Wire save/export/import
window.addEventListener('manual-save', saveNow);
window.addEventListener('manual-export', () => {
  const s = exportSave();
  navigator.clipboard?.writeText(s);
  alert('Save copied to clipboard.');
});
window.addEventListener('manual-import', (e) => {
  importSave(e.detail);
  updatePanels();
  updateOverview();
  renderLog();
});

runLoop();

// Simple dev helpers in console
window.__State = State;
