// js/typing-engine.js
// Simulates realistic typing activity among online members
// Requires: members-pool.js + synthetic-people.js

(function () {

  const TypingEngine = {

    interval: null,

    start() {
      if (this.interval) return;

      this.interval = setInterval(() => {
        const onlineMembers = window.SyntheticPeople.getOnlineMembers();
        if (!onlineMembers.length) return;

        // pick 1–3 random online members to type
        const typingCount = Math.max(1, Math.floor(Math.random() * 3));
        const selected = window.SyntheticPeople.getRandom(typingCount);

        selected.forEach(member => {
          window.SyntheticPeople.setTyping(member.id, true);

          // stop typing after random delay
          setTimeout(() => {
            window.SyntheticPeople.setTyping(member.id, false);

            // notify UI
            window.dispatchEvent(new CustomEvent("typing:update"));
          }, 2000 + Math.random() * 4000);
        });

        // notify UI
        window.dispatchEvent(new CustomEvent("typing:update"));

      }, 5000); // every 5 seconds
    },

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  };

  window.TypingEngine = TypingEngine;

})();
