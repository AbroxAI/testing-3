// js/simulation-engine.js

window.SimulationEngine = (function(){
  let config = {
    minDelay: 1000,
    maxDelay: 5000,
    multiMessageChance: 0.3,
    maxMulti: 3
  };
  let running = false;

  async function sendRandomMessage(){
    const online = window.SyntheticPeople.getOnlineMembers();
    if(online.length === 0) return;

    const member = online[Math.floor(Math.random() * online.length)];
    const text = window.SyntheticPeople.randomMessage();

    const msg = {
      text,
      authorId: member.name,
      timestamp: Date.now()
    };

    const added = window.MessagePool.addMessage(msg);
    window.Message.renderMessage(added);

    // Handle multi-message bursts
    if(Math.random() < config.multiMessageChance){
      const count = 1 + Math.floor(Math.random() * config.maxMulti);
      for(let i=1;i<count;i++){
        setTimeout(()=>{
          const burstText = window.SyntheticPeople.randomMessage();
          const burstMsg = { text: burstText, authorId: member.name, timestamp: Date.now() };
          const addedBurst = window.MessagePool.addMessage(burstMsg);
          window.Message.renderMessage(addedBurst);
        }, 500 + Math.random()*1000);
      }
    }
  }

  async function run(){
    if(!running) return;
    await sendRandomMessage();
    const delay = config.minDelay + Math.random()*(config.maxDelay-config.minDelay);
    setTimeout(run, delay);
  }

  function start(){
    running = true;
    run();
  }

  function stop(){
    running = false;
  }

  function configure(opts){
    config = {...config, ...opts};
  }

  return { start, stop, configure };
})();
