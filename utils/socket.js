import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

const initializeSocket = (server) => {
  const io = new Server(server, {
    path: "/server/socket.io", // ✅ Must match NGINX and frontend
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://13.235.48.255", // ✅ Direct IP used in production
        "https://devlinked.site",
        "https://www.devlinked.site",
        "13.235.48.255"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Connection established with", socket.id);

    socket.on("joinConversation", (conversationId) => {
      console.log(`User joined conversation ${conversationId}`);
      socket.join(conversationId);
    });

    socket.on("sendMessage", (conversationId, messageDetails) => {
      console.log("📨 Message sent");
      io.to(conversationId).emit("receiveMessage", messageDetails);
    });
  });
};

export default initializeSocket;
