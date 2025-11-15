export function autoSaveInit(G) {
    setInterval(()=>saveNow(G), 30000);
  }
  
  export function saveNow(G) {
    try {
      localStorage.setItem('celestial.save', btoa(JSON.stringify(G)));
    } catch {}
  }
  
  export function exportSave(G) {
    const s = btoa(JSON.stringify(G));
    navigator.clipboard?.writeText(s);
    alert('Save copied to clipboard.');
  }
  
  export function importSave(s) {
    try {
      const obj = JSON.parse(atob(s));
      localStorage.setItem('celestial.save', s);
      return true;
    } catch {
      return false;
    }
  }
  