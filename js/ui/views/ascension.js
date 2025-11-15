import { canAscend, doAscend } from '../../systems/meta.js';

export function updateAscension(G) {
  const el = document.getElementById('tab-ascension');
  if (!G.unlocks.ascension) {
    el.innerHTML = `<div class="card"><div class="small">Unlock at Level 10.</div></div>`;
    return;
  }
  el.innerHTML = `
    <div class="card">
      <h3>Ascension</h3>
      <div>Layer 2 Currency: ${Math.floor(G.meta.layer2.currency)}</div>
      <button class="btn ${canAscend(G)?'warn':'locked'}" ${canAscend(G)?'':'disabled'} id="btn-ascend">Ascend</button>
      <div class="small">Ascend to convert capped progress into Layer 2 currency and reveal deeper systems later.</div>
    </div>
  `;
  const b = el.querySelector('#btn-ascend');
  if (b) b.addEventListener('click', ()=>{
    if (!canAscend(G)) return;
    doAscend(G);
    alert('Ascended! Currency gained.');
  });
}
