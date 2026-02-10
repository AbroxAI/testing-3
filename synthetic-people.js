// js/synthetic-people.js
// Simulates members in the chat for a realistic environment

window.SyntheticPeople = (function(){
  const members = [];
  const names = [
    "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi",
    "Ivan", "Judy", "Karl", "Leo", "Mallory", "Niaj", "Olivia", "Peggy"
  ];

  function randomName() {
    return names[Math.floor(Math.random() * names.length)];
  }

  function randomId() {
    return 'user-' + Math.random().toString(36).slice(2,8);
  }

  function createMember() {
    const member = {
      id: randomId(),
      name: randomName(),
      online: Math.random() < 0.7, // 70% chance to be online
      avatar: `/assets/avatars/${Math.floor(Math.random()*3)+1}.png`
    };
    members.push(member);
    return member;
  }

  function getMembers() {
    return members;
  }

  function populate(count = 10) {
    for(let i=0;i<count;i++){
      createMember();
    }
    return members;
  }

  function getOnlineCount() {
    return members.filter(m => m.online).length;
  }

  return { createMember, getMembers, populate, getOnlineCount };
})();
