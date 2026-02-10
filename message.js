// js/message.js

window.Message = (function(){
  const chatContainer = document.getElementById('chat');
  const typingRow = document.getElementById('typingRow');
  const replyPreviewContainer = document.getElementById('replyPreviewContainer');

  function renderMessage(msg){
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.dataset.id = msg.id;

    let html = `<strong>${msg.authorId}</strong>: ${msg.text}`;
    if(msg.replyTo){
      html = `<div class="reply-thread">↳ Replying to #${msg.replyTo}</div>` + html;
    }

    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function showTyping(authorId){
    typingRow.textContent = `${authorId} is typing...`;
    typingRow.style.display = 'block';
  }

  function hideTyping(){
    typingRow.style.display = 'none';
  }

  function showReplyPreview(msg){
    replyPreviewContainer.hidden = false;
    replyPreviewContainer.textContent = `Replying to ${msg.authorId}: ${msg.text}`;
  }

  function hideReplyPreview(){
    replyPreviewContainer.hidden = true;
    replyPreviewContainer.textContent = '';
  }

  return {
    renderMessage,
    showTyping,
    hideTyping,
    showReplyPreview,
    hideReplyPreview
  };
})();
