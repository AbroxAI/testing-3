// js/message-pool.js

window.MessagePool = (function(){
  const messages = [];

  function addMessage(msg){
    const message = {
      id: messages.length + 1,
      text: msg.text || '',
      authorId: msg.authorId || 'system',
      timestamp: msg.timestamp || Date.now(),
      replyTo: msg.replyTo || null
    };
    messages.push(message);
    return message;
  }

  function getAllMessages(){
    return [...messages];
  }

  function getMessagesSince(timestamp){
    return messages.filter(m => m.timestamp > timestamp);
  }

  function getLastNMessages(n){
    return messages.slice(-n);
  }

  function clearAll(){
    messages.length = 0;
  }

  return {
    addMessage,
    getAllMessages,
    getMessagesSince,
    getLastNMessages,
    clearAll
  };
})();
