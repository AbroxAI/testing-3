// js/ui-adapter.js
// Connects UI inputs with MessagePool & Message rendering

window.uiAdapter = (function(){
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const emojiBtn = document.getElementById('emojiBtn');
  const replyPreviewContainer = document.getElementById('replyPreviewContainer');

  let currentReplyId = null;

  function prefill() {
    // Optionally prefill chat or inputs if needed
    messageInput.value = '';
  }

  function showReplyPreview(replyMsg) {
    currentReplyId = replyMsg.id;
    replyPreviewContainer.hidden = false;
    replyPreviewContainer.textContent = `Replying to: ${replyMsg.text}`;
  }

  function clearReplyPreview() {
    currentReplyId = null;
    replyPreviewContainer.hidden = true;
    replyPreviewContainer.textContent = '';
  }

  function getMessageFromInput() {
    const text = messageInput.value.trim();
    if(!text) return null;
    const msg = {
      id: 'msg-' + Math.random().toString(36).slice(2,8),
      authorId: 'me',
      text,
      timestamp: Date.now(),
      replyToId: currentReplyId
    };
    return msg;
  }

  function sendMessage() {
    const msg = getMessageFromInput();
    if(!msg) return;
    window.Message.renderMessage(msg);
    if(window.MessagePool) window.MessagePool.add(msg);
    messageInput.value = '';
    clearReplyPreview();
  }

  // Event bindings
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  emojiBtn.addEventListener('click', function(){
    // For demo, insert a smile emoji at cursor
    const emoji = '😊';
    const start = messageInput.selectionStart;
    const end = messageInput.selectionEnd;
    const val = messageInput.value;
    messageInput.value = val.slice(0,start) + emoji + val.slice(end);
    messageInput.focus();
    messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
  });

  return { prefill, showReplyPreview, clearReplyPreview, sendMessage };
})();
