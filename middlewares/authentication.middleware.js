import chalk from "chalk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const { userToken } = req.cookies;

    if (!userToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        error: "User token missing",
      });
    }

    try {
      const decodedData = jwt.verify(userToken, process.env.SECRET_KEY);
      const user = await User.findById(decodedData._id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          error: "Invalid token: user does not exist",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(
        chalk.red("JWT verification failed in auth.middleware.js -->"),
        error
      );
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
        error: error.message,
      });
    }
  } catch (error) {
    console.log(chalk.bgRed("Error in isAuthenticated middleware -->"), error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};
