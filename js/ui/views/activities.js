import { ACTIVITIES } from '../../data/activities.js';
import { format } from '../../core/utils.js';

export function updateActivities(G) {
  const el = document.getElementById('tab-activities');
  const btns = Object.values(ACTIVITIES).map(a=>{
    const locked = !G.player.activities.unlocked[a.id];
    const isActive = G.player.activities.active === a.id;
    return `
      <button class="btn ${isActive?'primary':''} ${locked?'locked':''}" ${locked?'disabled':''}
        title="${a.tooltip}"
        data-act="${a.id}">
        ${a.name} ${locked? lockLabel(a.gate): (isActive?'(Active)':'')}
      </button>
    `;
  }).join('');
  el.innerHTML = `
    <div class="card">
      <h3>Activities</h3>
      <div class="row">${btns}</div>
      <div class="small notice">Activities train their related skill and produce resources.</div>
    </div>
  `;
  el.querySelectorAll('button[data-act]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.act;
      if (!G.player.activities.unlocked[id]) return;
      G.player.activities.active = (G.player.activities.active===id)? null : id;
    });
  });
}

function lockLabel(gate) {
  if (!gate) return '';
  const reqs = [];
  if (gate.level) reqs.push(`Lvl ${gate.level}`);
  if (gate.qi) reqs.push(`Qi ${gate.qi}`);
  if (gate.insight) reqs.push(`Insight ${gate.insight}`);
  return ` (Locked: ${reqs.join(', ')})`;
}
