// ui.js
export const elements = {
  app: document.getElementById("app"),
  chatList: document.getElementById("chatList"),
  chatView: document.getElementById("chatView"),
  messages: document.getElementById("messages"),
  inputMessage: document.getElementById("inputMessage"),
  sendButton: document.getElementById("sendButton"),
  backButton: document.getElementById("backButton"),
  chatHeader: document.getElementById("chat-header"),
  chatUsername: document.getElementById("chatUsername"),
  splash: document.getElementById("splash"),
};

export function initApp() {
  console.log("Inicializando aplicación...");

  Object.entries(elements).forEach(([name, el]) => {
    if (!el) console.error(`Elemento no encontrado: ${name}`);
  });

  if (elements.backButton) {
    elements.backButton.onclick = () => {
      elements.app.classList.remove("hidden");
      elements.chatView.classList.add("hidden");
      elements.chatHeader.classList.add("hidden");
      window.currentConversationId = null;
    };
  }

  if (elements.splash) {
    setTimeout(() => {
      elements.splash.style.opacity = "0";
      setTimeout(() => {
        elements.splash.style.display = "none";
        elements.app.classList.remove("hidden");
      }, 1000);
    }, 3000);
  } else {
    elements.app.classList.remove("hidden");
  }
}
