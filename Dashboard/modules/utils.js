export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function playNotificationSound() {
  try {
    new Audio("/notification.mp3")
      .play()
      .catch((e) => console.log("Error de audio:", e));
  } catch (e) {
    console.warn("No se pudo reproducir sonido:", e);
  }
}

export function showError(message) {
  console.error("Error:", message);
}
