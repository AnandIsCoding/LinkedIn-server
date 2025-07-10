import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// send message, post, accepts receiverId and message in req.body and senderId of loggedIn user's re.user
export const createConversationController = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Required field missing" });
    }
    const ConversationExists = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (ConversationExists) {
      const addMessage = await Message.create({
        conversationId: ConversationExists._id,
        sender: senderId,
        message,
      });
    } else {
      const newConversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      const addmessage = await Message.create({
        conversationId: newConversation._id,
        sender: senderId,
        message,
      });
    }
    return res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in createConversationController in conversation.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error:
        "Error in createConversationController in conversation.controller.js",
    });
  }
};

// get all message
export const getConversationsController = async (req, res) => {
  try {
    const senderId = req.user._id;
    const conversations = await Conversation.find({
      members: { $in: [senderId] },
    })
      .populate("members", "-password")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({
        success: true,
        message: "Conversations fetched successfully",
        conversations,
      });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in getConversationsController in conversation.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error:
        "Error in getConversationsController in conversation.controller.js",
    });
  }
};
