// js/ui-adapter.js

window.uiAdapter = (function(){
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const emojiBtn = document.getElementById('emojiBtn');
  const mediaBtn = document.getElementById('mediaBtn');
  const micBtn = document.getElementById('micBtn');
  const fileInput = document.getElementById('fileInput');

  let replyToMessage = null;
  let micActive = false;

  function prefill(){
    input.value = '';
  }

  function setReply(msg){
    replyToMessage = msg;
    window.Message.showReplyPreview(msg);
  }

  function clearReply(){
    replyToMessage = null;
    window.Message.hideReplyPreview();
  }

  function sendMessage(){
    if(!input.value.trim() && !micActive) return;

    const msg = {
      text: input.value.trim() || '[Voice message]',
      authorId: 'You',
      timestamp: Date.now(),
      replyTo: replyToMessage ? replyToMessage.id : null
    };

    window.MessagePool.addMessage(msg);
    window.Message.renderMessage(msg);
    input.value = '';
    clearReply();

    if(micActive){
      micActive = false;
      micBtn.innerHTML = '<i data-lucide="mic"></i>';
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e){
    if(e.key === 'Enter') sendMessage();
  });

  micBtn.addEventListener('click', function(){
    micActive = !micActive;
    micBtn.innerHTML = micActive ? '<i data-lucide="send"></i>' : '<i data-lucide="mic"></i>';
  });

  emojiBtn.addEventListener('click', function(){
    input.value += '😊';
    input.focus();
  });

  mediaBtn.addEventListener('click', function(){
    fileInput.click();
  });

  fileInput.addEventListener('change', function(){
    const file = fileInput.files[0];
    if(file){
      sendMessage();
    }
  });

  return {
    prefill,
    setReply,
    clearReply,
    sendMessage
  };
})();
