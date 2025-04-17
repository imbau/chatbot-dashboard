import {
  renderConversations,
  selectionMode,
  selectedChats,
} from "./conversations.js";

export function toggleChatMenu(id, event) {
  event.stopPropagation();
  const menu = document.getElementById(`menu-${id}`);
  menu.classList.toggle("hidden");
}

export function startSelectionMode(initialId) {
  window.selectionMode = true;
  selectedChats.add(initialId);
  renderConversations();
  document.getElementById("actionBar").classList.remove("hidden");
}

export function toggleSelectChat(id) {
  if (selectedChats.has(id)) {
    selectedChats.delete(id);
  } else {
    selectedChats.add(id);
  }

  if (selectedChats.size === 0) {
    cancelSelectionMode();
  } else {
    renderConversations();
  }
}

export function cancelSelectionMode() {
  window.selectionMode = false;
  selectedChats.clear();
  renderConversations();
  document.getElementById("actionBar").classList.add("hidden");
}
