export function updateLog(G) {
    const el = document.getElementById('tab-log');
    const items = G.player.messageLog.slice(-50).map(m=>{
      const suffix = m.count>1 ? ` x${m.count}` : '';
      const t = new Date(m.time).toLocaleTimeString();
      return `<div class="small">[${t}] ${m.text}${suffix}</div>`;
    }).join('');
    el.innerHTML = `
      <div class="card">
        <h3>Log</h3>
        ${items || '<div class="small">No messages yet.</div>'}
      </div>
    `;
  }
  