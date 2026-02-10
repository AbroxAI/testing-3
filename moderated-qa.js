// js/moderated-qa.js

window.ModeratedQA = (function(){
  const pendingQueue = [];
  const approvedMessages = [];

  function submitQuestion(msg){
    // Add to pending queue for moderation
    pendingQueue.push(msg);
    console.log('[ModeratedQA] Question submitted:', msg.text);
  }

  function approveNext(){
    if(pendingQueue.length === 0) return null;
    const msg = pendingQueue.shift();
    approvedMessages.push(msg);

    // Render approved message
    window.Message.renderMessage(msg);
    console.log('[ModeratedQA] Question approved:', msg.text);
    return msg;
  }

  function rejectNext(){
    if(pendingQueue.length === 0) return null;
    const msg = pendingQueue.shift();
    console.log('[ModeratedQA] Question rejected:', msg.text);
    return msg;
  }

  function getPending(){
    return [...pendingQueue];
  }

  return {
    submitQuestion,
    approveNext,
    rejectNext,
    getPending
  };
})();
