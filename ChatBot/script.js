// script.js - Chatbot con OpenRouter + Conexión a Backend
const chatDiv = document.getElementById("chat");
const API_KEY =
  "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"; // Tu API Key de OpenRouter
const BACKEND_URL = "http://localhost/ChatBot-Dashboard/Backend";

// Historial de mensajes para OpenRouter (¡conservamos tu prompt original!)
const messages = [
  {
    role: "system",
    content:
      "Te llamas Epibot, eres un representante de atención al cliente de Epika, una empresa en donde las personas pagan por el desarrollo de su Software (web y móviles) con tecnologías como php, laravel, next js, react js, flutter, mysql, boostrap, material design, html 5, css 3, js, vue, node js, APIs de terceros, gateway de pagos, chatbots, IA, automatizaciones, desarrollo de videojuegos con Construct 2 y 3, Android, IOS, Java. Tu tarea es identificar si es un cliente potencial o un cliente buscando soporte. Si busca soporte debes buscar información para resolver su problema, siempre dandole la opción que hable con uno de nuestros representantes. Si es un cliente potencial, responder sus preguntas para dar confianza. Trabajamos de la siguiente manera: diseñamos un plan de proyecto indicando el tiempo y presupuesto de cada tarea, designamos un equipo de trabajo y hacemos reuniones semanales presentando los avances. El código es propiedad del cliente. Ofrecemos servicios de mantenimiento acordes a cada cliente y consultoría de negocios. Desarrollamos Saas, app moviles y webs. Tenemos 12 años en la industria del software. Necesito que dentro de la conversación, de forma discreta obtengas la información relevante del lead para gestionarlo como un prospecto: nombre, descripcion del proyecto, y si la conversación prospera los datos de contacto como telefono y correo electrónico. En el primer mensaje de bienvenida, quiero que aclares que eres un chatbot que esta guardando los datos de la conversación en el sistema y que esto servirá para agilizar el proceso y enviarle lo que necesite en menos de 24hs. Si desea hablar con un representante de la empresa, solo debe hacer click en el botón de whatsapp o escribirnos desde su celular al +542216216025. Si pide hablar con alguien debes dar por sentado que necesita hablar con alguien de la emresa. Responde de manera conscisa para responder la pregunta del usuario, y no alargues mucho la respuesta si no es necesario. No des toda la información que tienes al instante, trata de responder las preguntas del usuario únicamente. Debe identificar el idioma para responder en el idioma del usuario.",
  },
];

// Conexión WebSocket para notificaciones en tiempo real
const socket = { on: () => {} };

// Función para guardar mensajes en el backend
async function saveMessageToBackend(
  conversationId,
  content,
  sender,
  isAgentRequest = false
) {
  try {
    await fetch(`${BACKEND_URL}/api/messages.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        content: content,
        sender: sender,
        is_agent_request: isAgentRequest,
      }),
    });
  } catch (error) {
    console.error("Error al guardar en backend:", error);
  }
}

// Función sendMessage ORIGINAL (conservando OpenRouter) + integración con backend
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Mostrar mensaje del usuario (sin cambios)
  appendMessage("user", userMessage);
  messages.push({ role: "user", content: userMessage });

  // 2. Generar ID de conversación (si no existe)
  const conversationId =
    window.conversationId || (window.conversationId = crypto.randomUUID());

  // 3. Guardar mensaje en el backend
  const isAgentRequest = /representante|humano|agente/i.test(userMessage);
  await saveMessageToBackend(
    conversationId,
    userMessage,
    "user",
    isAgentRequest
  );

  input.value = "";

  // 4. Si es solicitud de agente, notificar y salir
  if (isAgentRequest) {
    appendMessage("jarvis", "Contactando a un representante...");
    return;
  }

  // 5. Respuesta del bot via OpenRouter (¡código original conservado!)
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Error en la API");

    const botReply = data.choices[0].message.content;
    appendMessage("jarvis", botReply);
    messages.push({ role: "assistant", content: botReply });

    // 6. Guardar respuesta del bot en el backend
    await saveMessageToBackend(conversationId, botReply, "bot");
  } catch (err) {
    appendMessage(
      "jarvis",
      "Error: " + (err.message || "No se pudo conectar al servidor")
    );
    console.error(err);
  }
}

// Funciones originales (sin cambios)
function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = `${sender === "user" ? "Vos" : "Epibot"}: ${text}`;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function toggleChat() {
  const container = document.getElementById("chat-container");
  container.classList.toggle("show");
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}
