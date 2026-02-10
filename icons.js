// js/icons.js

// Initialize Lucide icons (called after DOMContentLoaded in index.html)
document.addEventListener("DOMContentLoaded", function() {
  if (window.lucide) {
    lucide.createIcons();
    console.info('[Icons] Lucide icons initialized');
  } else {
    console.warn('[Icons] Lucide not found');
  }
});

// Optional: add custom icon mapping if needed
// Example: lucide.icons['custom-icon'] = '<svg>...</svg>';
