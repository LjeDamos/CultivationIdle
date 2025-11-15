window.Celestial = window.Celestial || {};
Celestial.defaultTraitPool = function() {
  return [
    { id:'quick_learner', name:'Quick Learner', tooltip:'Global skill XP +10%.', kind:'mult', mult:{ skillXp:1.10 } },
    { id:'iron_body', name:'Iron Body', tooltip:'VIT scaling +1 and damage taken reduced (future use).', kind:'flat', flat:{ VIT:+1 } },
    { id:'qi_conduit', name:'Qi Conduit', tooltip:'Qi gain +15%.', kind:'mult', mult:{ qiGain:1.15 } },
    { id:'artisan', name:'Artisan', tooltip:'Crafting yield +20%.', kind:'mult', mult:{ crafting:1.20 } },
    { id:'strategist', name:'Strategist', tooltip:'Leadership/automation efficiency (future), minor research +10%.', kind:'mult', mult:{ research:1.10 } },
    { id:'lucky_star', name:'Lucky Star', tooltip:'Rare event chance +20%.', kind:'mult', mult:{ luckRare:1.20 } },
    { id:'swift', name:'Swift', tooltip:'Action speed +10% for basic activities.', kind:'mult', mult:{ speed:1.10 } },
    { id:'stoic', name:'Stoic', tooltip:'Meditation speed +20%.', kind:'mult', mult:{ meditation:1.20 } },
    { id:'merchant', name:'Merchant', tooltip:'Trading (future) and stones yield +15%.', kind:'mult', mult:{ stones:1.15 } },
    { id:'scholar', name:'Scholar', tooltip:'Insight +20%.', kind:'mult', mult:{ insight:1.20 } },
  ];
};
