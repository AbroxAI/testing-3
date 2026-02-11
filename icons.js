// icons.js
// Abrox Chat — Icon loader and helper

const Icons = {
  init() {
    if (!window.lucide) {
      console.warn("Lucide not loaded, icons won't render.");
      return;
    }

    // Refresh all icons on the page
    lucide.createIcons();

    // Optionally, you can register custom icons here
    // Example:
    // lucide.addIcon("verified", "<svg ...>...</svg>");
  },

  refresh() {
    // Call this after dynamically adding elements to ensure icons render
    lucide.createIcons();
  }
};

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  Icons.init();
});
