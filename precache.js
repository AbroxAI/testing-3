// precache.js

window.Precache = (function(){
  const assets = [
    '/assets/logo.png',
    '/assets/avatars/admin1.png',
    '/assets/avatars/admin2.png',
    '/assets/avatars/admin3.png',
    '/assets/avatars/user1.png',
    '/assets/avatars/user2.png'
  ];

  function preloadImage(src){
    return new Promise((resolve)=>{
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src);
    });
  }

  async function start(){
    const promises = assets.map(preloadImage);
    await Promise.all(promises);
    console.info('[Precache] All assets preloaded');
  }

  return { start };
})();

// Auto-start precache
document.addEventListener('DOMContentLoaded', () => window.Precache.start());
