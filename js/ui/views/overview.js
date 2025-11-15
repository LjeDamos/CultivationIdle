import { format } from '../../core/utils.js';

export function updateOverview(G) {
  const el = document.getElementById('tab-overview');
  const hints = [];
  if (!G.player.race) hints.push('Pick a race and select 3 traits in Traits tab.');
  if (!G.player.activities.active) hints.push('Start an activity in Activities tab.');
  if (G.unlocks.automation) hints.push('Automation tab unlocked: set managers to run tasks.');
  if (G.unlocks.ascension) hints.push('Ascension tab unlocked: convert progress into metagrowth.');
  el.innerHTML = `
    <div class="card">
      <div class="row">
        <div class="col">
          <h3>Character</h3>
          <div class="kv">
            <div class="key">Race</div><div>${G.player.race || 'Unchosen'}</div>
            <div class="key">Age</div><div>${G.player.age.toFixed(1)} / ${G.player.lifespan.toFixed(1)}</div>
            <div class="key">Level</div><div>${G.player.level}</div>
          </div>
        </div>
        <div class="col">
          <h3>Resources</h3>
          <div class="res">Qi ${format(G.player.resources.qi)}</div>
          <div class="res">Stones ${format(G.player.resources.stones)}</div>
          <div class="res">Insight ${format(G.player.resources.insight)}</div>
          <div class="res">Herb ${format(G.player.resources.materials.herb)}</div>
          <div class="res">Ore ${format(G.player.resources.materials.ore)}</div>
          <div class="res">Beast ${format(G.player.resources.materials.beast)}</div>
        </div>
      </div>
      ${hints.length?`<hr class="sep"><div class="small">Hints: ${hints.join(' • ')}</div>`:''}
    </div>
  `;
}
