// js/icons.js
// Initialize Lucide icons dynamically
document.addEventListener("DOMContentLoaded", function() {
  if(window.lucide) {
    lucide.createIcons();
    console.info('[Icons] Lucide icons initialized');
  } else {
    console.warn('[Icons] Lucide not loaded');
  }
});
