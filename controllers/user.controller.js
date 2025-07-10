import chalk from "chalk";
import mongoose from "mongoose";

import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";


// search input box
export const searchUserController = async (req, res) => {
  try {
    let { query } = req.query;
    query = query?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    // console.log("Query received:", query);

    const users = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(req.user._id) },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).limit(50);

    // console.log("Users found:", users);

    return res.status(200).json({
      success: true,
      message: "User searched successfully",
      users,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright("Error in searchUserController --->>", error)
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// send friend request
export const sendFriendRequestController = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver } = req.body;
    const userReceiver = await User.findById(receiver);
    if (!userReceiver) {
      return res
        .status(404)
        .json({ success: false, message: "Request receiver not found" });
    }
    // check if already a friend
    const index = req.user.friends.findIndex((id) => id.equals(receiver));
    if (index !== -1) {
      return res
        .status(400)
        .json({ success: false, message: "Already friends" });
    }
    // check if request already sent
    const sentRequestIndex = userReceiver.pendingRequest.findIndex((id) =>
      id.equals(sender)
    );
    if (sentRequestIndex !== -1) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });
    }
    userReceiver.pendingRequest.push(sender);
    await userReceiver.save();

    const content = `${req.user.fullName} has sent you a friend request`;
    const notification = await Notification.create({
      sender,
      receiver,
      content,
      notificationType: "friendRequest",
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Request sent successfully",
        user: req.user,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in sendFriendRequestController in user.controller.js --->>",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// accept friend request
export const acceptFriendRequestController = async (req, res) => {
  try {
    const { requesterId } = req.body; // jo bheja h request
    const userId = req.user._id; // logged in user
    const friendData = await User.findById(requesterId);
    if (!friendData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const index = req.user.pendingRequest.findIndex((id) =>
      id.equals(requesterId)
    );
    if (index !== -1) {
      req.user.pendingRequest.splice(index, 1);
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "Request id not valid, no request found",
        });
    }
    req.user.friends.push(requesterId);
    friendData.friends.push(userId);

    const content = `${req.user.fullName} has accepted your friend request`;
    const notification = await Notification.create({
      sender: userId,
      receiver: requesterId,
      content,
      notificationType: "friendRequest",
    });

    await req.user.save();
    await friendData.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Friend request accepted successfully",
        user: req.user,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in acceptFriendRequestController in user.controller.js --->>",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// my all friends

export const getMyFriendsController = async (req, res) => {
  try {
    const allfriends = await req.user.populate("friends");
    return res
      .status(200)
      .json({
        success: true,
        message: "Friends fetched successfully",
        friends: allfriends.friends,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getMyFriendsController in user.controller.js --->>",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all pending friend requests
export const getMyPendingFriendRequests = async (req, res) => {
  try {
    const allPendingFriendRequests = await req.user.populate("pendingRequest");
    return res
      .status(200)
      .json({
        success: true,
        message: "Pending Requests fetched successfully",
        pendingRequests: allPendingFriendRequests.pendingRequest,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getMyPendingFriendRequests in user.controller.js --->>",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//  remove a friend , friendId passed via params
export const removeFriendController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const user = await User.findById(userId);
    const friendData = await User.findById(friendId);
    const index = await user.friends.findIndex((id) => id.equals(friendId));
    const indexinfriend = await friendData.friends.findIndex((id) =>
      id.equals(userId)
    );
    if (index !== -1) {
      user.friends.splice(index, 1);
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "No Friend found with the id (in first person)",
        });
    }
    if (indexinfriend !== -1) {
      friendData.friends.splice(indexinfriend, 1);
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "No Friend found with the id (in 2nd person)",
        });
    }
    await user.save();
    await friendData.save();
    return res
      .status(200)
      .json({
        success: false,
        message: "Unfriend successfully",
        user: req.user,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in removeFriendController in user.controller.js --->>",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
