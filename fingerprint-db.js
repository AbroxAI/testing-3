(async function(){
  try{
    // create floating panel
    let p = document.getElementById('abrox-fp-panel');
    if(p) p.remove();
    p = document.createElement('div');
    p.id = 'abrox-fp-panel';
    Object.assign(p.style, {
      position:'fixed', right:'12px', bottom:'12px', width:'340px', maxHeight:'60vh', overflow:'auto',
      background:'#031023', color:'#dbeafe', border:'1px solid rgba(255,255,255,0.04)', padding:'12px', zIndex:2147483647,
      fontFamily:'system-ui,Segoe UI,Roboto,Arial', fontSize:'13px', borderRadius:'10px', boxShadow:'0 6px 20px rgba(0,0,0,0.6)'
    });
    p.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Abrox Fingerprint Check</div><div id="abrox-fp-contents">Checking…</div><div style="margin-top:10px;text-align:right"><button id="abrox-fp-close">Close</button> <button id="abrox-fp-clear">Clear test keys</button></div>';
    document.body.appendChild(p);
    document.getElementById('abrox-fp-close').onclick = ()=>p.remove();
    document.getElementById('abrox-fp-clear').onclick = async ()=>{
      try{
        if(window.FingerprintDB && FingerprintDB.clear) await FingerprintDB.clear();
        localStorage.removeItem('abrox_fps_v1');
        localStorage.removeItem('abrox_meta_v1');
        alert('Fingerprint DB cleared (IDB/localStorage). Reload page to confirm.');
      }catch(e){ alert('Clear failed: '+e); }
    };

    const outEl = id => document.getElementById(id);
    const out = (html) => { outEl('abrox-fp-contents').innerHTML = html; };

    if(!window.FingerprintDB){
      out('<div style="color:#ffb4b4">FingerprintDB not found — check js/fingerprint-db.js is loaded and path is correct.</div>');
      return;
    }

    out('Initializing FingerprintDB…');
    await FingerprintDB.init();

    const debug = { useIDB: !!FingerprintDB._useIDB, ready: !!FingerprintDB._ready };
    let count = 'n/a';
    try{ count = await FingerprintDB.count(); }catch(e){ count = 'err'; }

    // sample keys
    const keys = [];
    if(FingerprintDB._useIDB && FingerprintDB._db){
      try{
        const db = FingerprintDB._db;
        const tx = db.transaction(['fps'],'readonly');
        const store = tx.objectStore('fps');
        await new Promise((resolve)=>{
          const rq = store.openCursor();
          rq.onsuccess = e=>{
            const cur = e.target.result;
            if(cur && keys.length < 20){ keys.push(cur.key); cur.continue(); } else resolve();
          };
          rq.onerror = ()=>resolve();
        });
      }catch(e){}
    } else {
      try{
        const raw = localStorage.getItem('abrox_fps_v1');
        if(raw){ const arr = JSON.parse(raw); for(let i=0;i<Math.min(arr.length,20);i++) keys.push(arr[i]); }
      }catch(e){}
    }

    const hasSmoke = keys.some(k=>String(k).includes('abrox-smoke-test')) || keys.some(k => /^f[0-9a-f]{6,}/.test(String(k)));

    let html = `<div style="margin-bottom:6px"><strong>Ready:</strong> ${debug.ready} &nbsp; <strong>IDB:</strong> ${debug.useIDB}</div>`;
    html += `<div style="margin-bottom:6px"><strong>Total fingerprints:</strong> ${count}</div>`;
    html += `<div style="margin-bottom:6px"><strong>Sample keys (${keys.length}):</strong></div>`;
    if(!keys.length) html += '<div style="color:#9aa4b2">No fingerprints found</div>';
    else html += '<ol style="padding-left:18px;margin:0 0 8px 0;color:#cfe8ff">' + keys.map(k=>`<li style="margin-bottom:6px;word-break:break-all">${String(k)}</li>`).join('') + '</ol>';
    html += `<div><strong>Smoke-test present:</strong> ${hasSmoke?'<span style="color:#a3f6a3">yes</span>':'<span style="color:#ffb4b4">no</span>'}</div>`;
    html += `<div style="margin-top:8px;color:#9aa4b2;font-size:12px">Tip: use 'Clear test keys' then reload to re-run tests cleanly.</div>`;

    out(html);
  }catch(err){
    const el = document.getElementById('abrox-fp-contents');
    if(el) el.innerHTML = '<div style="color:#ffb4b4">Error: '+String(err)+'</div>';
    console.error(err);
  }
})();
