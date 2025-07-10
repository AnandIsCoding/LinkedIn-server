import { Router } from "express";

import {
  getActiveNotificationController,
  getNotificationsController,
  updateIsReadController,
} from "../controllers/notification.controller.js";
import { isAuthenticated } from "../middlewares/authentication.middleware.js";
const notificationRouter = Router();

notificationRouter.get("/all", isAuthenticated, getNotificationsController);
notificationRouter.get(
  "/active",
  isAuthenticated,
  getActiveNotificationController
);
notificationRouter.put(
  "/updateIsRead",
  isAuthenticated,
  updateIsReadController
);

export default notificationRouter;
