// js/synthetic-people.js

window.SyntheticPeople = (function(){
  const members = [];
  const NAMES = ['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Hector','Ivy','Jack'];
  const AVATARS = [
    '/assets/avatars/admin1.png',
    '/assets/avatars/admin2.png',
    '/assets/avatars/admin3.png',
    '/assets/avatars/user1.png',
    '/assets/avatars/user2.png'
  ];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createMember(id) {
    const member = {
      id: id,
      name: randomChoice(NAMES) + id,
      avatar: randomChoice(AVATARS),
      online: Math.random() < 0.7, // 70% chance online
      typing: false
    };
    members.push(member);
    return member;
  }

  function getAllMembers() {
    return members;
  }

  function getOnlineMembers() {
    return members.filter(m => m.online);
  }

  function toggleTyping(memberId, state){
    const m = members.find(x => x.id === memberId);
    if(m) m.typing = state;
  }

  return {
    createMember,
    getAllMembers,
    getOnlineMembers,
    toggleTyping
  };
})();
