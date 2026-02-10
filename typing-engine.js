// js/typing-engine.js
// Simulates typing for synthetic members

window.TypingEngine = (function(){
  const chatInput = document.getElementById('messageInput');

  let activeTypers = new Set();

  function typeMessage(member, message, callback){
    if(activeTypers.has(member)) return; // already typing
    activeTypers.add(member);
    window.PresenceManager.memberTyping(member);

    let idx = 0;
    const interval = 50 + Math.random() * 100; // variable typing speed

    function typeNext(){
      if(idx < message.length){
        // Could show partial typing in UI if needed
        idx++;
        setTimeout(typeNext, interval);
      } else {
        activeTypers.delete(member);
        window.PresenceManager.memberStopTyping(member);
        if(callback) callback();
      }
    }

    typeNext();
  }

  // Random simulated typing for synthetic people
  function simulateRandomTyping(members, messages){
    if(!members || members.length === 0) return;

    const member = members[Math.floor(Math.random() * members.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    typeMessage(member, message, ()=> {
      // after typing finished, trigger message sending in simulation
      if(window.SimulationEngine) SimulationEngine.sendSyntheticMessage(member, message);
    });
  }

  // Start periodic simulation
  function startSimulation(members, messages, interval=3000){
    setInterval(()=>simulateRandomTyping(members, messages), interval);
  }

  return {
    typeMessage,
    simulateRandomTyping,
    startSimulation
  };
})();
