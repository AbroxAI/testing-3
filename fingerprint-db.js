// fingerprint-db.js
// Abrox Chat — Fingerprint + IndexedDB helper (preloads 722 members)

const FingerprintDB = {
  dbName: 'AbroxFingerprintDB',
  storeName: 'fingerprints',
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event);
        reject(event);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('FingerprintDB initialized.');
        resolve();
      };
    });
  },

  async saveFingerprint(fingerprint) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.add(fingerprint);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e);
    });
  },

  async getAllFingerprints() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e);
    });
  },

  // Preload 722 synthetic members
  async preloadMembers(count = 722) {
    if (!this.db) throw new Error('DB not initialized');

    const existing = await this.getAllFingerprints();
    if (existing.length >= count) {
      console.log(`Already have ${existing.length} members, skipping preload.`);
      return;
    }

    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    for (let i = 1; i <= count; i++) {
      const member = {
        name: `User${i}`,
        avatar: `./assets/avatars/avatar${(i % 50) + 1}.png`, // loop through 50 sample avatars
        online: Math.random() < 0.7, // ~70% online
        typing: false,
        verified: Math.random() < 0.2, // ~20% verified
        joined: Date.now() - Math.floor(Math.random() * 1000000000)
      };
      store.add(member);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log(`Preloaded ${count} synthetic members.`);
        resolve();
      };
      tx.onerror = (e) => reject(e);
    });
  }
};

// Auto-init and preload
document.addEventListener('DOMContentLoaded', async () => {
  await FingerprintDB.init();
  await FingerprintDB.preloadMembers();
  const all = await FingerprintDB.getAllFingerprints();
  console.log('Total members loaded:', all.length);
});
