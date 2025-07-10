import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();
const initializeSocket = (server) => {
  // ✅ Initialize the Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.webSocketUrl,
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // handle events
    console.log("Connection established");
    // new conversation
    socket.on("joinConversation", (conversationId) => {
      console.log(`User joined for conversationId --->> ${conversationId}`);
      socket.join(conversationId);
    });
    // send message
    socket.on("sendMessage", (conversationId, messageDetails) => {
      console.log("Message sent");
      io.to(conversationId).emit("receiveMessage", messageDetails);
    });
  });
};

export default initializeSocket;
