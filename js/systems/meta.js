export function canAscend(G) {
    return G.player.level >= 20;
  }
  
  export function doAscend(G) {
    // Convert some progress into layer2 currency
    const gained = Math.max(0, Math.floor(G.player.level * 0.5));
    G.meta.layer2.currency += gained;
    // Reveal layers 3/4 later via flags
    if (!G.meta.layer3.unlocked && G.meta.layer2.currency >= 50) G.meta.layer3.unlocked = true;
    if (!G.meta.layer4.unlocked && G.meta.layer2.currency >= 200) G.meta.layer4.unlocked = true;
  }
  