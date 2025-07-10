import chalk from "chalk";
import mongoose from "mongoose";

import Message from "../models/message.model.js";
import {
  isFileTypeSupported,
  uploadFileToCloudinary,
} from "../utils/helpers.utils.js";
export const sendNewMessageController = async (req, res) => {
  try {
    const senderId = req.user._id;
    // console.log('request Body ---> ',req.body)
    const { conversationId, message } = req.body;

    if (!req.file && (!message || message.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Either message text or image is required to send message",
      });
    }
    let imageUrl = "";
    if (req.file) {
      const supportedTypes = ["jpeg", "jpg", "png"];
      const fileType = req.file.originalname.split(".").pop().toLowerCase();

      if (!isFileTypeSupported(fileType, supportedTypes)) {
        return res.status(400).json({
          success: false,
          message: "Invalid File type. Only jpg, jpeg and png supported.",
          error: "Unsupported file type",
        });
      }

      const response = await uploadFileToCloudinary(
        req.file.path,
        "My-LinkedIn"
      );
      imageUrl = response.secure_url;
    }
    // create a new message
    const newMessage = await Message.create({
      conversationId: new mongoose.Types.ObjectId(conversationId), // OR ensure it's stored as ObjectId
      sender: senderId,
      message: message || "",
      image: imageUrl || "",
    });

    // response
    const populatedMessage = await newMessage.populate("sender");
    return res.status(201).json({
      success: true,
      message: `${
        imageUrl === ""
          ? "Message sent successfully"
          : "Image sent successfully"
      }`,
      newMessage: populatedMessage,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in sendNewMessageController in message.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in sendNewMessageController in message.controller.js",
    });
  }
};

// get messages

export const getMessagesController = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // ✅ Validate conversationId
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Valid conversation ID is required",
      });
    }

    // ✅ Fetch messages with matching ObjectId
    const messages = await Message.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    })
      .populate("sender", "-password") // Populate sender excluding password
      .sort({ createdAt: 1 }); // Sort oldest to newest

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getMessagesController in message.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getMessagesController in message.controller.js",
    });
  }
};
