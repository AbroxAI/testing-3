`// js/fingerprint-test.js
// One-time smoke test for FingerprintDB

(async function(){
  try{
    if(!window.FingerprintDB){
      console.error('FingerprintDB not found — ensure js/fingerprint-db.js is loaded by index.html');
      return;
    }
    console.log('[FP TEST] Initializing FingerprintDB...');
    await FingerprintDB.init();
    console.log('[FP TEST] ready:', !!FingerprintDB._ready);

    // Use a unique test string so this fingerprint won't collide with real content.
    const uniqueTestString = 'abrox-smoke-test-' + (new Date()).toISOString() + '-' + Math.random().toString(36).slice(2,8);
    const fp = await FingerprintDB.fingerprintText(uniqueTestString);
    console.log('[FP TEST] fingerprint:', fp);
    console.log('[FP TEST] has before add?', await FingerprintDB.has(fp));

    // Add fingerprint (persisted to IDB or localStorage fallback)
    await FingerprintDB.add(fp);
    console.log('[FP TEST] has after add?', await FingerprintDB.has(fp));

    console.log('[FP TEST] Done — added a unique fingerprint. You can remove this file and the <script> tag after verification.');
  }catch(err){
    console.error('[FP TEST] error:', err);
  }
})();
