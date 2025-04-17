export function sendMessage() {
  const message = document.getElementById("inputMessage").value.trim();
  if (!message || !window.currentConversationId) return;

  fetch("http://localhost/ChatBot-Dashboard/Backend/api/messages.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: window.currentConversationId,
      content: message,
      sender: "agent",
    }),
  }).then((res) => {
    if (res.ok) document.getElementById("inputMessage").value = "";
  });
}
