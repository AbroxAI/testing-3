// js/presence-manager.js

window.PresenceManager = (function(){
  const membersListEl = document.getElementById('membersList');
  const onlineCountEl = document.getElementById('onlineCount');
  const memberCountEl = document.getElementById('memberCount');

  function renderMember(member){
    let el = document.getElementById('member-'+member.id);
    if(!el){
      el = document.createElement('div');
      el.id = 'member-'+member.id;
      el.className = 'member';
      membersListEl.appendChild(el);
    }
    el.innerHTML = `<img src="${member.avatar}" width="24" height="24" style="border-radius:50%;margin-right:6px;"> 
                    <span>${member.name}</span> ${member.online ? '🟢' : '⚪'}`;
  }

  function updateAll(){
    const members = window.SyntheticPeople.getAllMembers();
    members.forEach(renderMember);
    const onlineCount = window.SyntheticPeople.getOnlineMembers().length;
    onlineCountEl.textContent = onlineCount;
    memberCountEl.textContent = members.length;
  }

  function setOnline(memberId, state){
    const member = window.SyntheticPeople.getAllMembers().find(m => m.id === memberId);
    if(member){
      member.online = state;
      renderMember(member);
      updateAll();
    }
  }

  function init(){
    updateAll();
  }

  return {
    renderMember,
    updateAll,
    setOnline,
    init
  };
})();
