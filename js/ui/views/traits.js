import { RACES } from '../../data/races.js';
import { defaultTraitPool } from '../../data/traits.js';

export function updateTraits(G) {
  const el = document.getElementById('tab-traits');

  const raceBtns = Object.entries(RACES).map(([k,r])=>{
    const selected = (G.player.race === r.name);
    return `<button class="btn ${selected?'primary':''}" title="${r.tooltip}" data-race="${k}">${r.name}</button>`;
  }).join('');

  const pool = rollTraitChoices(G);
  const chosenIds = new Set(G.player.traits.map(t=>t.id));
  const traitBtns = pool.map(t=>{
    const picked = chosenIds.has(t.id);
    const disabled = picked || (G.player.traits.length>=3 && !picked);
    return `<button class="btn ${picked?'primary':''}" title="${t.tooltip}" data-trait="${t.id}" ${disabled?'disabled':''}>${t.name}</button>`;
  }).join('');

  el.innerHTML = `
    <div class="card">
      <h3>Race</h3>
      <div class="row">${raceBtns}</div>
      <div class="small">Race provides subtle stat and rate modifiers.</div>
    </div>
    <div class="card">
      <h3>Traits (pick 3)</h3>
      <div class="row">${traitBtns}</div>
      <div class="small">Traits expand as you earn achievements and progress across lives.</div>
    </div>
  `;

  el.querySelectorAll('[data-race]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const key = b.dataset.race;
      G.player.race = RACES[key].name;
    });
  });
  el.querySelectorAll('[data-trait]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.trait;
      const poolT = (G.player.traits || []);
      const exists = poolT.find(x=>x.id===id);
      if (exists) {
        // allow unpick
        G.player.traits = G.player.traits.filter(x=>x.id!==id);
      } else if (G.player.traits.length < 3) {
        const t = defaultTraitPool().find(x=>x.id===id);
        if (t) G.player.traits.push(t);
      }
      updateTraits(G);
    });
  });
}

function rollTraitChoices(G) {
  // 9 random from pool (+ extra unlocked)
  const base = defaultTraitPool();
  const extra = G.player.traitPoolExtra || 0;
  const pool = [...base];
  // naive shuffle
  for (let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool.slice(0, 9 + extra);
}
