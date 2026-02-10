// js/fingerprint-db.js

window.FingerprintDB = (function(){
  const DB_KEY = 'abrox_fingerprints';
  const _fps = [];

  async function init() {
    // Load from localStorage (or IndexedDB if later upgraded)
    const stored = localStorage.getItem(DB_KEY);
    if(stored){
      const parsed = JSON.parse(stored);
      if(Array.isArray(parsed)) _fps.push(...parsed);
    }
  }

  async function fingerprintText(txt) {
    // Simple hash-like string for demo; in production, replace with real hash/fingerprint logic
    return 'fp-' + Math.random().toString(36).slice(2,8);
  }

  async function has(fp){
    return _fps.includes(fp);
  }

  async function add(fp){
    if(!_fps.includes(fp)){
      _fps.push(fp);
      localStorage.setItem(DB_KEY, JSON.stringify(_fps));
    }
  }

  async function count(){
    return _fps.length;
  }

  return { init, fingerprintText, has, add, count };
})();
