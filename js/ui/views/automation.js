export function updateAutomation(G) {
    const el = document.getElementById('tab-automation');
    if (!G.unlocks.automation) {
      el.innerHTML = `<div class="card"><div class="small">Unlock at Level 3.</div></div>`;
      return;
    }
    el.innerHTML = `
      <div class="card">
        <h3>Managers</h3>
        <div class="small">Assign simple managers (coming soon): this version provides a foundation. Use Activities tab for now.</div>
      </div>
    `;
  }
  