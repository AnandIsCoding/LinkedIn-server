import chalk from "chalk";
import mongoose from "mongoose";

import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

// add comment to the post , accepts postId and comment from request body
export const addCommentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, comment } = req.body;
    //  console.log(userId, '  ', postId, '  ', comment)
    if (!postId || !userId || !comment) {
      return res.status(400).json({
        success: false,
        message: "Required field missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "PostId isn't a valid ObjectId",
      });
    }
    const post = await Post.findById({ _id: postId }).populate(
      "user",
      "-password"
    );
    if (!post) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Post not found",
          error: "Post not found",
        });
    }

    const newComment = await Comment.create({
      user: userId,
      post: postId,
      comment,
    });
    await newComment.populate("user", "fullName headline profilePic");
    post.totalComments = post.totalComments + 1;
    post.comments.push(newComment._id);

    await post.save();

    // now we need to populate user of new comment, because notification content will contain fullname of user
    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "fullName email profilePic about headline"
    );
    const content = `${populatedComment.user.fullName} has commented on your post`;
    const notification = await Notification.create({
      sender: userId,
      receiver: post.user._id,
      content,
      notificationType: "comment",
      postId,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added to post successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in addCommentController in comment.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in addCommentController in comment.controller.js",
    });
  }
};

// get all comment of the particular post, get comments by postId
export const getCommentByPostIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "PostId not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "PostId isn't a valid ObjectId",
      });
    }
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "fullName email profilePic headline about");
    return res
      .status(201)
      .json({
        success: true,
        message: "Comments fetched by id successfully",
        comments,
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getCommentByPostIdController in comment.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getCommentByPostIdController in comment.controller.js",
    });
  }
};
