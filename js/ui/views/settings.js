export function updateSettings(G) {
    const el = document.getElementById('tab-settings');
    el.innerHTML = `
      <div class="card">
        <h3>Settings</h3>
        <div class="small">Autosave every 30s. Export/Import available in footer.</div>
        <div>Version: ${G.version}</div>
      </div>
    `;
  }
  