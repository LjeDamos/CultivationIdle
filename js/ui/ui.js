// ui.js
import { SKILLS } from '../data/skills.js';

export const ui = {
  unlockTab(id, unlocked) {
    const btn = document.querySelector(`.tab[data-tab="${id}"]`);
    if (!btn) return;
    if (unlocked) btn.classList.remove('locked');
    else btn.classList.add('locked');
  },

  buildUI(G) {
    // preload skill defs onto G for formulas
    G.skillDefs = SKILLS;
  }
};

export function switchTab(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));

  const viewId = `tab-${id}`;
  const view = document.getElementById(viewId);
  const tab = document.querySelector(`.tab[data-tab="${id}"]`);

  if (view) view.classList.add('active');
  if (tab) tab.classList.add('active');
}
