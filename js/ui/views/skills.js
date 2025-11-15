import { SKILLS } from '../../data/skills.js';
import { format } from '../../core/utils.js';

export function updateSkills(G) {
  const el = document.getElementById('tab-skills');
  const rows = Object.entries(SKILLS).map(([k,def])=>{
    const s = G.player.skills[k];
    const need = 10 + s.level * 10 * (1 + 0.1 * Math.floor(s.level/10));
    const prog = Math.max(0, Math.min(1, s.xp / need));
    return `
      <tr>
        <td title="${def.tooltip}">${def.name}</td>
        <td>${s.level}</td>
        <td><div class="progress"><span style="width:${(prog*100).toFixed(1)}%"></span></div></td>
      </tr>
    `;
  }).join('');
  el.innerHTML = `
    <div class="card">
      <h3>Skills</h3>
      <table class="table">
        <thead><tr><th>Skill</th><th>Level</th><th>Progress</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}
