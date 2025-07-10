import { Router } from "express";
const commentRouter = Router();
import {
  addCommentController,
  getCommentByPostIdController,
} from "../controllers/comment.controller.js";
import { isAuthenticated } from "../middlewares/authentication.middleware.js";
commentRouter.post("/add", isAuthenticated, addCommentController);
commentRouter.get(
  "/post/:postId",
  isAuthenticated,
  getCommentByPostIdController
);
export default commentRouter;
