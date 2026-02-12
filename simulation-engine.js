// js/simulation-engine.js
// Simulates online/offline and typing behavior for your synthetic members

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
        // Random presence toggling
        const presenceInterval = setInterval(() => {
          const isOnline = Math.random() < 0.65; // 65% chance online
          SyntheticPeople.setOnline(member.id, isOnline);
        }, 5000 + Math.random() * 5000); // 5–10s interval

        this.intervalIds.push(presenceInterval);

        // Random typing simulation
        const typingInterval = setInterval(() => {
          if (!member.online) return; // Only online members type
          const isTyping = Math.random() < 0.2; // 20% chance to type
          SyntheticPeople.setTyping(member.id, isTyping);

          if (isTyping) {
            // Stop typing after short duration
            setTimeout(() => SyntheticPeople.setTyping(member.id, false), 2000 + Math.random() * 3000);
          }
        }, 3000 + Math.random() * 4000); // 3–7s interval

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
