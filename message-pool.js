// js/message-pool.js
// Handles storage and retrieval of messages for the chat simulation

window.MessagePool = (function(){
  const messages = [];

  function addMessage(msg) {
    // msg: {id, authorId, text, timestamp, replyToId (optional)}
    messages.push(msg);
    return msg;
  }

  function getMessages() {
    return messages;
  }

  function getLastMessage() {
    return messages[messages.length - 1] || null;
  }

  function getMessagesByAuthor(authorId) {
    return messages.filter(m => m.authorId === authorId);
  }

  function getMessagesSince(timestamp) {
    return messages.filter(m => m.timestamp > timestamp);
  }

  return { addMessage, getMessages, getLastMessage, getMessagesByAuthor, getMessagesSince };
})();
