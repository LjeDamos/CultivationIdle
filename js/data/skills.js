window.Celestial = window.Celestial || {};
Celestial.SKILLS = {
  meditation: { name:'Meditation', baseXP: 1, attr:'SPIRIT', gamma: 0.02, k: 1.0, tooltip:'Gather Qi and gain Meditation levels, increasing cultivation speed.' },
  martial: { name:'Martial Arts', baseXP: 1, attr:'STR', gamma: 0.02, k: 1.0, tooltip:'Train body for combat; improves combat yields.' },
  gathering: { name:'Gathering', baseXP: 1, attr:'AGI', gamma: 0.02, k: 1.0, tooltip:'Collect herbs/ores/beast parts more efficiently.' },
  research: { name:'Research', baseXP: 1, attr:'INT', gamma: 0.02, k: 1.0, tooltip:'Generate Insight for unlocks and efficiency.' },
  crafting: { name:'Crafting', baseXP: 1, attr:'INT', gamma: 0.02, k: 1.0, tooltip:'Create tools that unlock automation and efficiency jumps.' },
};

Celestial.makeInitialSkills = function() {
  return Object.fromEntries(Object.keys(Celestial.SKILLS).map(k=>[k,{ level:0, xp:0 }]));
};
