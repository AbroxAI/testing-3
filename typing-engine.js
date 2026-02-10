// js/typing-engine.js

window.TypingEngine = (function(){
  const typingRow = document.getElementById('typingRow');

  function memberTyping(memberId, duration = 2000){
    const member = window.SyntheticPeople.getAllMembers().find(m => m.id === memberId);
    if(!member) return;

    member.typing = true;
    window.Message.showTyping(member.name);

    setTimeout(()=>{
      member.typing = false;
      window.Message.hideTyping();
    }, duration);
  }

  function randomTyping(){
    const online = window.SyntheticPeople.getOnlineMembers();
    if(online.length === 0) return;
    const member = online[Math.floor(Math.random()*online.length)];
    memberTyping(member.id, 1000 + Math.random()*2000);
  }

  function startAutoTyping(interval = 5000){
    setInterval(randomTyping, interval);
  }

  return {
    memberTyping,
    randomTyping,
    startAutoTyping
  };
})();
