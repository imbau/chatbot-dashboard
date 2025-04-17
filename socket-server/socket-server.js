// socket-server.js
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Cambialo si lo querés más seguro
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });

  socket.on("send_message", (data) => {
    console.log("📨 Mensaje recibido:", data);
    io.emit("new_message", data); // reenviar a todos
  });

  socket.on("change_mode", (data) => {
    console.log("🔁 Cambio de modo:", data);
    io.emit("modeChanged", data);
  });

  socket.on("new_conversation", (data) => {
    console.log("💬 Nueva conversación:", data);
    io.emit("new_conversation", data);
  });
});

server.listen(5000, () => {
  console.log("🚀 Socket.IO server corriendo en http://localhost:5000");
});
