// js/simulation-engine.js
// Simulates online/offline and typing behavior for synthetic members
// Dispatches update events so PresenceManager and UI stay synced

(function () {

  if (!window.SyntheticPeople) {
    console.warn("SyntheticPeople not loaded yet. Simulation engine will not run.");
    return;
  }

  const SimulationEngine = {
    intervalIds: [],

    start() {
      const members = SyntheticPeople.getAll();

      members.forEach(member => {

        // --- PRESENCE SIMULATION ---
        const presenceInterval = setInterval(() => {
          const isOnline = Math.random() < 0.65; // 65% chance online
          SyntheticPeople.setOnline(member.id, isOnline);

          // notify system
          window.dispatchEvent(new Event("presence:update"));

        }, 5000 + Math.random() * 5000);

        this.intervalIds.push(presenceInterval);


        // --- TYPING SIMULATION ---
        const typingInterval = setInterval(() => {

          const current = SyntheticPeople.getById(member.id);
          if (!current || !current.online) return;

          const isTyping = Math.random() < 0.2;
          SyntheticPeople.setTyping(member.id, isTyping);

          window.dispatchEvent(new Event("typing:update"));

          if (isTyping) {
            setTimeout(() => {
              SyntheticPeople.setTyping(member.id, false);
              window.dispatchEvent(new Event("typing:update"));
            }, 2000 + Math.random() * 3000);
          }

        }, 3000 + Math.random() * 4000);

        this.intervalIds.push(typingInterval);
      });

      console.log(`SimulationEngine started for ${members.length} members.`);
    },

    stop() {
      this.intervalIds.forEach(id => clearInterval(id));
      this.intervalIds = [];
      console.log("SimulationEngine stopped.");
    }
  };

  window.SimulationEngine = SimulationEngine;

})();
