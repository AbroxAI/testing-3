// js/presence-manager.js
// Tracks live presence stats and notifies UI

(function () {

  if (!window.SyntheticPeople) {
    console.warn("SyntheticPeople not loaded yet. PresenceManager waiting.");
    return;
  }

  const PresenceManager = {

    stats: {
      online: 0,
      typing: 0,
      verified: 0
    },

    calculate() {
      const members = SyntheticPeople.getAll();

      this.stats.online = members.filter(m => m.online).length;
      this.stats.typing = members.filter(m => m.typing).length;
      this.stats.verified = members.filter(m => m.verified).length;

      // broadcast update event
      window.dispatchEvent(new CustomEvent("presence:stats", {
        detail: { ...this.stats }
      }));
    },

    start() {
      // initial calc
      this.calculate();

      // recalc whenever simulation updates
      window.addEventListener("presence:update", () => this.calculate());
      window.addEventListener("typing:update", () => this.calculate());

      console.log("PresenceManager started.");
    },

    getStats() {
      return { ...this.stats };
    }

  };

  window.PresenceManager = PresenceManager;

  // auto start
  document.addEventListener("DOMContentLoaded", () => {
    PresenceManager.start();
  });

})();
