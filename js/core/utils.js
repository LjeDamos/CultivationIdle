window.Celestial = window.Celestial || {};
Celestial.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
Celestial.lerp = (a,b,t) => a + (b-a)*t;

Celestial.softcap = function softcap(value, breakpoint, powerAbove=0.5) {
  if (value <= breakpoint) return value;
  const over = value - breakpoint;
  return breakpoint + Math.pow(over, powerAbove);
};

Celestial.format = function format(n) {
  if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
  if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(2)+'K';
  return Math.floor(n).toString();
};

Celestial.weightedRandomPick = function weightedRandomPick(list, weightFn) {
  const weights = list.map(weightFn);
  const sum = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*sum;
  for (let i=0;i<list.length;i++){
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length-1];
};