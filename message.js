// js/message.js
// Responsible for rendering messages into the chat container

window.Message = (function(){
  const chatContainer = document.getElementById('chat');

  function renderMessage(msg) {
    // msg: {id, authorId, text, timestamp, replyToId (optional)}

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message';
    msgDiv.dataset.id = msg.id;

    let content = '';
    if(msg.replyToId) {
      content += `<div class="chat-reply">Replying to: <span data-reply-id="${msg.replyToId}">${msg.replyToId}</span></div>`;
    }
    content += `<div class="chat-text">${msg.text}</div>`;
    content += `<div class="chat-meta"><small>${new Date(msg.timestamp).toLocaleTimeString()}</small></div>`;

    msgDiv.innerHTML = content;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function renderMessages(msgArray) {
    msgArray.forEach(renderMessage);
  }

  return { renderMessage, renderMessages };
})();
