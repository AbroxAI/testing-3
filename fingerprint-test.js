(async function(){
  try{
    if(!window.FingerprintDB){
      console.error('FingerprintDB not found');
      return;
    }

    await FingerprintDB.init();

    const txt = 'test-' + Date.now();
    const fp = await FingerprintDB.fingerprintText(txt);

    console.log('fingerprint:', fp);

    await FingerprintDB.add(fp);

    console.log('count now', await FingerprintDB.count());

  }catch(e){
    console.error(e);
  }
})();
