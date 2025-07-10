import { Router } from "express";

import upload from "../configs/multer.config.js";
import {
  getProfileByIdController,
  logoutController,
  registerWithGoogleController,
  updateUserController,
  userLoginController,
  userRegisterController,
  verifyOtpController,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/authentication.middleware.js";

const authRouter = Router();

authRouter.post("/register", userRegisterController);
authRouter.post("/verify", verifyOtpController);
authRouter.post("/login", userLoginController);
authRouter.post("/google", registerWithGoogleController);

authRouter.get("/profile", isAuthenticated, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message || "Internal Server Error",
    });
  }
});

authRouter.put(
  "/update",
  upload.fields([
    { name: "profileBanner", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  isAuthenticated,
  updateUserController
);

authRouter.get("/profile/:id", isAuthenticated, getProfileByIdController);

authRouter.delete("/logout", isAuthenticated, logoutController);

export default authRouter;
