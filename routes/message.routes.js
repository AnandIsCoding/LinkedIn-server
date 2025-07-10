import { Router } from "express";
const messageRouter = Router();
import upload from "../configs/multer.config.js";
import {
  getMessagesController,
  sendNewMessageController,
} from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/authentication.middleware.js";

messageRouter.post(
  "/new",
  isAuthenticated,
  upload.single("image"),
  sendNewMessageController
);
messageRouter.get("/:conversationId", isAuthenticated, getMessagesController);

export default messageRouter;
