// Create a container for logs
let logContainer = document.getElementById('fpLogs');
if(!logContainer){
    logContainer = document.createElement('pre');
    logContainer.id = 'fpLogs';
    logContainer.style.background = '#071124';
    logContainer.style.color = '#cfe8ff';
    logContainer.style.padding = '10px';
    logContainer.style.fontSize = '12px';
    logContainer.style.height = '300px';
    logContainer.style.overflow = 'auto';
    logContainer.style.border = '1px solid #0b1220';
    logContainer.style.margin = '10px';
    document.body.prepend(logContainer);
}

// Helper to write logs to page
function logToPage(msg){
    logContainer.textContent += msg + '\n';
}

// Override console.log/error to also print on page
const originalLog = console.log;
const originalError = console.error;
console.log = function(...args){ logToPage(args.join(' ')); originalLog.apply(console, args); };
console.error = function(...args){ logToPage('❌ ' + args.join(' ')); originalError.apply(console, args); };

(async function(){
    try{
        console.log('🔎 Initializing FingerprintDB...');
        if(!window.FingerprintDB){ 
            console.error('FingerprintDB not found — ensure js/fingerprint-db.js is loaded'); 
            return; 
        }
        await FingerprintDB.init();
        console.log('✅ FingerprintDB ready');

        const uniqueTestString = 'abrox-smoke-test-' + (new Date()).toISOString() + '-' + Math.random().toString(36).slice(2,8);
        const fp = await FingerprintDB.fingerprintText(uniqueTestString);
        console.log('🆔 Fingerprint:', fp);

        console.log('❓ Has before add?', await FingerprintDB.has(fp));
        await FingerprintDB.add(fp);
        console.log('✅ Has after add?', await FingerprintDB.has(fp));

        const count = await FingerprintDB.count();
        console.log('📦 Total fingerprints now:', count);

        console.log('🎉 Fingerprint test complete.');
    }catch(e){
        console.error(e);
    }
})();
