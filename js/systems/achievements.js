import { addLog } from './logs.js';

export const ACHIEVEMENTS = [
  { id:'skill5', name:'First Steps', desc:'Reach any skill level 5.', check:G=>maxSkill(G)>=5, reward:(G)=> expandTraits(G,1) },
  { id:'skill10', name:'Apprentice', desc:'Reach any skill level 10.', check:G=>maxSkill(G)>=10, reward:(G)=> expandTraits(G,2) },
  { id:'lvl5', name:'Awakening', desc:'Reach character level 5.', check:G=>G.player.level>=5, reward:(G)=> expandTraits(G,1) },
  { id:'insight100', name:'Curious Mind', desc:'Accumulate 100 Insight total in a life.', check:G=>G.player.resources.insight>=100, reward:(G)=> expandTraits(G,1) },
];

function maxSkill(G) {
  let m = 0; for (const s of Object.values(G.player.skills)) m = Math.max(m, s.level||0); return m;
}

function expandTraits(G, n) {
  G.player.traitPoolExtra = (G.player.traitPoolExtra||0) + n;
  addLog(G, `Trait pool expanded by ${n}. Future runs will present more options.`);
}

export function tickAchievements(G) {
  for (const a of ACHIEVEMENTS) {
    if (!G.player.achievements[a.id] && a.check(G)) {
      G.player.achievements[a.id] = true;
      a.reward(G);
      addLog(G, `Achievement: ${a.name}`);
    }
  }
}
