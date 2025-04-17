// home.js (archivo principal)
import { initApp, elements } from "./modules/ui.js";
import {
  loadConversations,
  loadMessages,
  renderConversations,
  deleteSelectedChats,
  pinSelectedChats,
  infoSelectedChats,
} from "./modules/conversations.js";
import { sendMessage } from "./modules/messaging.js";
import { socketInit } from "./modules/socket.js";
import {
  toggleChatMenu,
  startSelectionMode,
  toggleSelectChat,
  cancelSelectionMode,
} from "./modules/selection.js";

window.loadMessages = loadMessages;
window.toggleChatMenu = toggleChatMenu;
window.startSelectionMode = startSelectionMode;
window.toggleSelectChat = toggleSelectChat;
window.cancelSelectionMode = cancelSelectionMode;
window.deleteSelectedChats = deleteSelectedChats;
window.pinSelectedChats = pinSelectedChats;
window.infoSelectedChats = infoSelectedChats;

// Inicializar aplicación
initApp();
socketInit();
loadConversations();

// Eventos globales
elements.sendButton?.addEventListener("click", sendMessage);
elements.inputMessage?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
let modoBotActivo = true;

function setupBotToggle() {
  const toggle = document.getElementById("botToggle");
  const status = document.getElementById("toggleStatus");

  if (!toggle || !status) return;

  toggle.addEventListener("change", () => {
    modoBotActivo = toggle.checked;

    if (modoBotActivo) {
      status.textContent = "Modo bot activado 🤖";
      console.log("✅ Bot activado");
    } else {
      status.textContent = "Modo manual activado 🙋‍♂️";
      console.log("🛑 Modo manual");
    }
  });
}

// Asegurate de llamarlo al cargar la app:
document.addEventListener("DOMContentLoaded", setupBotToggle);
