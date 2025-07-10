import chalk from "chalk"; // Chalk for colored console logs
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";

import connectToCloudinary from "./configs/cloudinary.config.js";
import connectToDb from "./configs/database.config.js";
import authRouter from "./routes/auth.routes.js";
import commentRouter from "./routes/comment.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import messageRouter from "./routes/message.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import initializeSocket from "./utils/socket.js";
dotenv.config();

const app = express();

//Cloudinary configuration

connectToCloudinary()
  .then(() =>
    console.log(chalk.bgYellow("Connected to Cloudinary successfully ✅ ✅ "))
  )
  .catch((error) =>
    console.error(
      chalk.bgRed("�� Error in connecting to Cloudinary :" + error.message)
    )
  );

// SERVER PORT
const PORT = process.env.SERVER_PORT || 7000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:7000",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user/auth", authRouter); //     /api/v1/user/auth/register
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/message", messageRouter);

const server = http.createServer(app);
// ✅ Initialize the Socket.IO server

initializeSocket(server);

// database connection
connectToDb()
  .then(() => {
    console.log(
      chalk.bgMagenta("Connected to MongoDB Database successfully ✅ ✅ ")
    );
    server.listen(PORT, () => {
      console.log(
        chalk.bgGreenBright(
          `🚀 Server is listening at http://localhost:${PORT}`
        )
      );
    });
  })
  .catch((error) => {
    console.error(
      chalk.bgRed("❌Error in connecting to MongoDB Database :" + error.message)
    );
    process.exit(1); // exit the process with an error status code 1
  });

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Now Start Building controllers" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
