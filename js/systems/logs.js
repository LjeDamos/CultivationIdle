export function addLog(G, text) {
    const list = G.player.messageLog;
    const last = list[list.length-1];
    const now = Date.now();
    if (last && last.text === text && now - last.time < 5000) {
      last.count = (last.count||1) + 1;
      last.time = now;
    } else {
      list.push({ text, time: now, count: 1 });
    }
    if (list.length > 200) list.splice(0, list.length - 200);
  }
  