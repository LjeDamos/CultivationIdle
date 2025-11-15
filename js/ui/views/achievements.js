import { ACHIEVEMENTS } from '../../systems/achievements.js';

export function updateAchievements(G) {
  const el = document.getElementById('tab-achievements');
  const rows = ACHIEVEMENTS.map(a=>{
    const ok = !!G.player.achievements[a.id];
    return `<tr><td>${a.name}</td><td>${a.desc}</td><td>${ok? '✓' : '—'}</td></tr>`;
  }).join('');
  el.innerHTML = `
    <div class="card">
      <h3>Achievements</h3>
      <table class="table">
        <thead><tr><th>Name</th><th>Description</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}
