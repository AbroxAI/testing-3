// js/presence-manager.js
// Tracks online members, typing indicators, and updates UI counts

window.PresenceManager = (function(){
  const onlineCountEl = document.getElementById('onlineCount');
  const memberCountEl = document.getElementById('memberCount');
  const typingRow = document.getElementById('typingRow');

  let onlineMembers = [];
  let typingMembers = [];

  function updateCounts() {
    onlineCountEl.textContent = onlineMembers.length;
    memberCountEl.textContent = `Members: ${onlineMembers.length}`;
  }

  function showTyping() {
    if(typingMembers.length === 0){
      typingRow.hidden = true;
    } else if(typingMembers.length === 1){
      typingRow.hidden = false;
      typingRow.textContent = `${typingMembers[0]} is typing...`;
    } else {
      typingRow.hidden = false;
      typingRow.textContent = `${typingMembers.join(', ')} are typing...`;
    }
  }

  function memberOnline(member) {
    if(!onlineMembers.includes(member)){
      onlineMembers.push(member);
      updateCounts();
    }
  }

  function memberOffline(member) {
    onlineMembers = onlineMembers.filter(m => m !== member);
    typingMembers = typingMembers.filter(m => m !== member);
    updateCounts();
    showTyping();
  }

  function memberTyping(member) {
    if(!typingMembers.includes(member)) typingMembers.push(member);
    showTyping();
  }

  function memberStopTyping(member) {
    typingMembers = typingMembers.filter(m => m !== member);
    showTyping();
  }

  // For simulation: random typing events
  function simulateTyping(member) {
    memberTyping(member);
    setTimeout(()=>memberStopTyping(member), 2000 + Math.random()*3000);
  }

  return {
    memberOnline,
    memberOffline,
    memberTyping,
    memberStopTyping,
    simulateTyping
  };
})();
