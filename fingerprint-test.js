(async function(){
  try{
    if(!window.FingerprintDB){
      console.error('❌ FingerprintDB not found — ensure js/fingerprint-db.js is loaded');
      return;
    }

    console.log('🔎 Initializing FingerprintDB...');
    await FingerprintDB.init();
    console.log('✅ FingerprintDB ready:', !!FingerprintDB._ready);

    // Unique test string
    const uniqueTestString = 'abrox-smoke-test-' + (new Date()).toISOString() + '-' + Math.random().toString(36).slice(2,8);
    const fp = await FingerprintDB.fingerprintText(uniqueTestString);
    console.log('🆔 Fingerprint:', fp);

    // Before adding
    const hasBefore = await FingerprintDB.has(fp);
    console.log('❓ Has before add?', hasBefore);

    // Add fingerprint
    await FingerprintDB.add(fp);
    const hasAfter = await FingerprintDB.has(fp);
    console.log('✅ Has after add?', hasAfter);

    // Count total fingerprints
    const count = await FingerprintDB.count();
    console.log('📦 Total fingerprints now:', count);

    console.log('🎉 Fingerprint test complete. This fingerprint is persisted in IDB or localStorage.');
  }catch(err){
    console.error('❌ Fingerprint test error:', err);
  }
})();
