import { elements } from "./ui.js";
import { formatTime, playNotificationSound, showError } from "./utils.js";

export let conversations = [];
export let selectionMode = false;
export let selectedChats = new Set();

export async function loadConversations() {
  try {
    const response = await fetch(
      "http://localhost/ChatBot-Dashboard/Backend/api/conversations.php"
    );
    if (!response.ok) throw new Error("Error al cargar conversaciones");

    conversations = await response.json();
    renderConversations();
  } catch (error) {
    console.error("Error:", error);
    showError("No se pudieron cargar las conversaciones");
  }
}

export function renderConversations() {
  if (!elements.chatList) return;

  elements.chatList.innerHTML = conversations
    .map(
      (conv) => `
<div class="chat-card ${conv.status === "human" ? "human-chat" : ""}" 
     data-conversation-id="${conv.id}">
  <div class="chat-info" onclick="loadMessages('${conv.id}')">
    <span class="username">Chat #${conv.id.slice(0, 6)}</span>
    <span class="message-preview">
      ${
        conv.last_message
          ? conv.last_message.slice(0, 30) + "..."
          : "Nueva conversación"
      }
    </span>
    <span class="timestamp">${
      conv.last_message_time ? formatTime(conv.last_message_time) : ""
    }</span>
  </div>
  <div class="chat-actions">
    ${
      !selectionMode
        ? `
       <div class="menu-options">
         <button class="menu-button" onclick="toggleChatMenu('${conv.id}', event)">⋮</button>
         <div class="menu-dropdown hidden" id="menu-${conv.id}">
           <button onclick="startSelectionMode('${conv.id}')">Eliminar chat</button>
         </div>
       </div>`
        : ""
    }
  </div>
</div>`
    )
    .join("");
}

export async function loadMessages(conversationId) {
  try {
    const response = await fetch(
      `http://localhost/ChatBot-Dashboard/Backend/api/messages.php?conversation_id=${conversationId}`
    );
    if (!response.ok) throw new Error("Error al cargar mensajes");

    const messages = await response.json();
    window.currentConversationId = conversationId;

    elements.app.classList.add("hidden");
    elements.chatView.classList.remove("hidden");
    elements.chatHeader.classList.remove("hidden");
    elements.chatUsername.textContent = `Chat #${conversationId.slice(0, 6)}`;

    elements.messages.innerHTML = messages
      .map((msg) => `<div class="message ${msg.sender}">${msg.content}</div>`)
      .join("");

    elements.messages.scrollTop = elements.messages.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    showError("No se pudieron cargar los mensajes");
  }
}

export async function deleteSelectedChats() {
  const confirmDelete = confirm(
    "¿Estás seguro de que querés eliminar los chats seleccionados?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      "http://localhost/ChatBot-Dashboard/Backend/api/delete_chats.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedChats) }),
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      conversations = conversations.filter((c) => !selectedChats.has(c.id));
      cancelSelectionMode();
      renderConversations();
    } else {
      alert("No se pudieron eliminar los chats: " + result.error);
    }
  } catch (error) {
    console.error("Error al eliminar chats:", error);
    alert("Ocurrió un error al intentar eliminar los chats.");
  }
}

export function pinSelectedChats() {
  console.log("Fijar chats:", [...selectedChats]);
}

export function infoSelectedChats() {
  console.log("Mostrar info (por ahora no hace nada)");
}
