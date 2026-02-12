// js/simulation-engine.js
// Controls global community simulation (presence + typing + message trigger)
// Requires: synthetic-people.js

(function () {

  if (!window.SyntheticPeople) {
    console.warn("SyntheticPeople not loaded yet. SimulationEngine waiting.");
    return;
  }

  const SimulationEngine = {

    interval: null,

    start() {
      if (this.interval) return;

      this.interval = setInterval(() => {

        const members = SyntheticPeople.getAll();
        if (!members.length) return;

        // pick random active members
        const activeCount = Math.floor(Math.random() * 6) + 1;

        for (let i = 0; i < activeCount; i++) {

          const member = members[Math.floor(Math.random() * members.length)];

          // presence change
          if (Math.random() < 0.4) {
            SyntheticPeople.setOnline(member.id, Math.random() < 0.7);
          }

          // typing simulation
          if (member.online && Math.random() < 0.35) {
            SyntheticPeople.setTyping(member.id, true);

            setTimeout(() => {
              SyntheticPeople.setTyping(member.id, false);
              window.dispatchEvent(new CustomEvent("typing:update"));
            }, 1500 + Math.random() * 2500);
          }

          // trigger message event (handled by message engine)
          if (member.online && Math.random() < 0.25) {
            window.dispatchEvent(new CustomEvent("member:message", {
              detail: { memberId: member.id }
            }));
          }
        }

        // notify presence change
        window.dispatchEvent(new CustomEvent("presence:update"));

      }, 4000);

      console.log("SimulationEngine started.");
    },

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  };

  window.SimulationEngine = SimulationEngine;

})();
