(async function(){
  if(!window.FingerprintDB){ console.error('FingerprintDB not found — check js/fingerprint-db.js path'); return; }
  await FingerprintDB.init();
  console.log('FP ready?', FingerprintDB._ready);
  const fp = await FingerprintDB.fingerprintText('smoke-check-' + Date.now());
  console.log('sample fp', fp);
  console.log('has before?', await FingerprintDB.has(fp));
  await FingerprintDB.add(fp);
  console.log('has after?', await FingerprintDB.has(fp));
  console.log('count now', await FingerprintDB.count());
})();
