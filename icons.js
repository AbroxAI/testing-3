// js/icons.js
// Initializes and manages icons for the chat UI

// Ensure lucide icons are created after DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  if(window.lucide) {
    lucide.createIcons();
    console.info('[Icons] Lucide icons initialized');
  } else {
    console.warn('[Icons] Lucide not found');
  }
});

// Optional helper to dynamically refresh icons if needed
window.updateIcons = function(){
  if(window.lucide) {
    lucide.createIcons();
    console.info('[Icons] Lucide icons refreshed');
  }
};
