import { conversations, renderConversations } from "./conversations.js";

export function socketInit() {
  const socket = io("http://localhost:5000");

  socket.on("new_conversation", (data) => {
    conversations.unshift({
      id: data.conversation_id,
      last_message: data.message,
      last_message_time: data.timestamp,
      status: "bot",
    });
    renderConversations();
  });

  socket.on("new_message", (data) => {
    const conv = conversations.find((c) => c.id === data.conversation_id);
    if (conv) {
      conv.last_message = data.content;
      conv.last_message_time = data.timestamp;
      renderConversations();
    }

    if (window.currentConversationId === data.conversation_id) {
      const msgElement = document.createElement("div");
      msgElement.className = `message ${data.sender}`;
      msgElement.textContent = data.content;
      document.getElementById("messages").appendChild(msgElement);
      document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight;
    }
  });

  socket.on("modeChanged", (data) => {
    if (data.conversationId === window.currentConversationId) {
      window.updateUI(data.mode);
      const div = document.createElement("div");
      div.textContent = data.message;
      div.style.color = "gray";
      document.getElementById("messages").appendChild(div);
    }
  });
}
import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

export const socket = io("http://localhost:5000");
