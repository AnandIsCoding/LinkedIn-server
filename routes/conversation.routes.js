import { Router } from "express";

import {
  createConversationController,
  getConversationsController,
} from "../controllers/conversation.controller.js";
import { isAuthenticated } from "../middlewares/authentication.middleware.js";

const conversationRouter = Router();
conversationRouter.post("/new", isAuthenticated, createConversationController);
conversationRouter.get("/all", isAuthenticated, getConversationsController);

export default conversationRouter;
