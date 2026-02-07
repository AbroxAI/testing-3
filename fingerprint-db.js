// js/fingerprint-db.js
// Lightweight fingerprint + IDB/localStorage helper
// Keeps a registry of fingerprints to prevent duplicates

const FingerprintDB = (function(){
  const DB_NAME = 'abrox_fps';
  const STORE_NAME = 'fps';
  const META_STORE = 'meta';
  let _db = null;
  let _useIDB = false;

  async function init() {
    if(_db) return;
    if(!window.indexedDB) {
      console.warn('[FingerprintDB] IndexedDB not supported, falling back to localStorage');
      _useIDB = false;
      return;
    }

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onerror = e => { console.warn('[FingerprintDB] IDB open failed', e); _useIDB=false; resolve(); };
      req.onsuccess = e => { _db = e.target.result; _useIDB=true; resolve(); };
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        if(!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE);
      };
    });
  }

  function fingerprintText(str) {
    // Simple hash (deterministic) — you can replace with better hash if needed
    let hash = 0;
    for(let i=0;i<str.length;i++){
      hash = ((hash<<5)-hash)+str.charCodeAt(i);
      hash |= 0;
    }
    return 'fp_' + Math.abs(hash);
  }

  async function has(fp) {
    if(!_useIDB) {
      const arr = JSON.parse(localStorage.getItem('abrox_fps_v1')||'[]');
      return arr.includes(fp);
    }
    return new Promise(resolve => {
      const tx = _db.transaction([STORE_NAME],'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fp);
      req.onsuccess = e => resolve(!!e.target.result);
      req.onerror = e => resolve(false);
    });
  }

  async function add(fp) {
    if(!_useIDB) {
      const arr = JSON.parse(localStorage.getItem('abrox_fps_v1')||'[]');
      if(!arr.includes(fp)) arr.push(fp);
      localStorage.setItem('abrox_fps_v1', JSON.stringify(arr));
      return;
    }
    return new Promise(resolve => {
      const tx = _db.transaction([STORE_NAME],'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(true, fp);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>resolve();
    });
  }

  async function count() {
    if(!_useIDB) {
      const arr = JSON.parse(localStorage.getItem('abrox_fps_v1')||'[]');
      return arr.length;
    }
    return new Promise(resolve => {
      const tx = _db.transaction([STORE_NAME],'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = e=>resolve(e.target.result);
      req.onerror = e=>resolve(0);
    });
  }

  async function putMeta(key,value){
    if(!_useIDB){ localStorage.setItem('abrox_meta_'+key, JSON.stringify(value)); return; }
    return new Promise(resolve=>{
      const tx = _db.transaction([META_STORE],'readwrite');
      const store = tx.objectStore(META_STORE);
      store.put(value,key);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>resolve();
    });
  }

  async function getMeta(key){
    if(!_useIDB){ 
      const val = localStorage.getItem('abrox_meta_'+key);
      return val ? JSON.parse(val) : null;
    }
    return new Promise(resolve=>{
      const tx = _db.transaction([META_STORE],'readonly');
      const store = tx.objectStore(META_STORE);
      const req = store.get(key);
      req.onsuccess = e=>resolve(e.target.result);
      req.onerror = e=>resolve(null);
    });
  }

  return { init, fingerprintText, has, add, count, putMeta, getMeta, _db, _useIDB };
})();
