// fingerprint-db.js
// Fingerprint + IndexedDB helper for Abrox
// Exposes global `FingerprintDB` with async API:
//   init(), fingerprintText(text), has(fp), add(fp), addMany(fps), count(), putMeta(k,v), getMeta(k), clear()
//
// Usage:
//   await FingerprintDB.init();
//   const fp = await FingerprintDB.fingerprintText("Some message");
//   if(!(await FingerprintDB.has(fp))){ await FingerprintDB.add(fp); }

(function FingerprintDBIIFE(){
  if(window.FingerprintDB) return;

  const DB_NAME = 'abrox_fp_v1';
  const DB_VERSION = 1;
  const STORE_FPS = 'fps';
  const STORE_META = 'meta';

  // ---------- helpers ----------
  function openIDB(){
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB not supported'));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE_FPS)) db.createObjectStore(STORE_FPS);
        if(!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IDB open error'));
    });
  }

  async function idbRequest(storeName, mode, callback){
    if(!FingerprintDB._useIDB) throw new Error('IDB not initialized');
    const db = FingerprintDB._db;
    const tx = db.transaction([storeName], mode);
    const store = tx.objectStore(storeName);
    const result = await callback(store);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('IDB transaction error'));
      tx.onabort = () => reject(tx.error || new Error('IDB transaction abort'));
    });
  }

  // normalize text for fingerprinting
  function normalizeText(str){
    return String(str || '')
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, '')           // strip URLs
      .replace(/[^\u00BF-\u1FFF\u2C00-\uD7FF\w\s]|_/g, '')   // remove punctuation (keep unicode ranges)
      .replace(/\s+/g, ' ')
      .trim();
  }

  // compute SHA-256 hex fingerprint using crypto.subtle
  async function fingerprintText(text){
    const normalized = normalizeText(text);
    if(!normalized) return '';
    if(typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest){
      const enc = new TextEncoder();
      const data = enc.encode(normalized);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const bytes = new Uint8Array(hash);
      let s = '';
      for(const b of bytes) s += b.toString(16).padStart(2, '0');
      return s;
    }
    // fallback: a quick non-crypto hash (less safe but useful)
    let h = 2166136261 >>> 0;
    for(let i=0;i<normalized.length;i++){
      h ^= normalized.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return 'f' + (h >>> 0).toString(16);
  }

  // ---------- in-memory fallback store ----------
  const memStore = {
    fps: new Set(),
    meta: {}
  };

  // ---------- public API object ----------
  const FingerprintDB = {
    _useIDB: false,
    _db: null,
    _ready: false,

    // init: try IDB, otherwise fall back to in-memory + localStorage
    async init(){
      if(this._ready) return;
      try{
        const db = await openIDB();
        this._db = db;
        this._useIDB = true;
        this._ready = true;
        return;
      }catch(e){
        console.warn('FingerprintDB: IndexedDB unavailable, falling back to in-memory/localStorage.', e);
        // try to hydrate memStore from localStorage if present
        try{
          const fpsRaw = localStorage.getItem('abrox_fps_v1');
          if(fpsRaw){ const arr = JSON.parse(fpsRaw); arr.forEach(f => memStore.fps.add(f)); }
          const metaRaw = localStorage.getItem('abrox_meta_v1');
          if(metaRaw) memStore.meta = JSON.parse(metaRaw);
        }catch(e){}
        this._useIDB = false;
        this._db = null;
        this._ready = true;
      }
    },

    fingerprintText, // expose function

    async has(fp){
      if(!fp) return false;
      if(this._useIDB){
        return idbRequest(STORE_FPS, 'readonly', (store) => {
          return new Promise((resolve) => {
            const r = store.get(fp);
            r.onsuccess = () => resolve(typeof r.result !== 'undefined');
            r.onerror = () => resolve(false);
          });
        });
      } else {
        return memStore.fps.has(fp);
      }
    },

    async add(fp){
      if(!fp) return;
      if(this._useIDB){
        return idbRequest(STORE_FPS, 'readwrite', (store) => {
          store.put(1, fp);
          return true;
        });
      } else {
        memStore.fps.add(fp);
        // persist a snapshot occasionally (cheap)
        try{ localStorage.setItem('abrox_fps_v1', JSON.stringify(Array.from(memStore.fps).slice(-5000))); }catch(e){}
      }
    },

    async addMany(fps){
      if(!Array.isArray(fps) || !fps.length) return;
      if(this._useIDB){
        return idbRequest(STORE_FPS, 'readwrite', (store) => {
          for(const f of fps) store.put(1, f);
          return true;
        });
      } else {
        for(const f of fps) memStore.fps.add(f);
        try{ localStorage.setItem('abrox_fps_v1', JSON.stringify(Array.from(memStore.fps).slice(-5000))); }catch(e){}
      }
    },

    async count(){
      if(this._useIDB){
        return idbRequest(STORE_FPS, 'readonly', (store) => {
          return new Promise((resolve) => {
            const req = store.count();
            req.onsuccess = () => resolve(req.result || 0);
            req.onerror = () => resolve(0);
          });
        });
      } else {
        return memStore.fps.size;
      }
    },

    async putMeta(k, v){
      if(this._useIDB){
        return idbRequest(STORE_META, 'readwrite', (store) => { store.put(v, k); return true; });
      } else {
        memStore.meta[k] = v;
        try{ localStorage.setItem('abrox_meta_v1', JSON.stringify(memStore.meta)); }catch(e){}
      }
    },

    async getMeta(k){
      if(this._useIDB){
        return idbRequest(STORE_META, 'readonly', (store) => {
          return new Promise((resolve) => {
            const r = store.get(k);
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => resolve(undefined);
          });
        });
      } else {
        return memStore.meta[k];
      }
    },

    async clear(){
      if(this._useIDB){
        return idbRequest(STORE_FPS, 'readwrite', (store) => { store.clear(); return true; }).then(() => {
          return idbRequest(STORE_META, 'readwrite', (s) => { s.clear(); return true; });
        });
      } else {
        memStore.fps.clear();
        memStore.meta = {};
        try{ localStorage.removeItem('abrox_fps_v1'); localStorage.removeItem('abrox_meta_v1'); }catch(e){}
      }
    }
  };

  // expose globally
  window.FingerprintDB = FingerprintDB;
  console.info('FingerprintDB helper loaded. Call FingerprintDB.init() first.');
})();
