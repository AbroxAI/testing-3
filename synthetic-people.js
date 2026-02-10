// js/synthetic-people.js

window.SyntheticPeople = (function(){
  const people = [];

  // Example avatars — use your /assets/avatars/ folder
  const avatars = [
    '/assets/avatars/admin1.png',
    '/assets/avatars/admin2.png',
    '/assets/avatars/admin3.png',
    '/assets/avatars/user1.png',
    '/assets/avatars/user2.png'
  ];

  // Example names
  const names = [
    'BotAlpha','BotBeta','BotGamma','TraderJoe','TraderAmy'
  ];

  // Create a person object
  function createPerson(id){
    const name = names[Math.floor(Math.random()*names.length)];
    const avatar = avatars[Math.floor(Math.random()*avatars.length)];
    const online = Math.random() > 0.2; // 80% chance online
    const person = { id, name, avatar, online };
    people.push(person);
    return person;
  }

  // Get all people
  function getAll(){ return people; }

  // Get by ID
  function getById(id){ return people.find(p=>p.id===id); }

  // Prefill N people
  function prefill(count=5){
    for(let i=0;i<count;i++){
      createPerson('p'+i);
    }
    console.info('[SyntheticPeople] Prefilled', count, 'people');
    return people;
  }

  return {
    createPerson,
    getAll,
    getById,
    prefill
  };
})();
