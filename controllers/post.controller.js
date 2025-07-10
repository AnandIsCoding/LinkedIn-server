import chalk from "chalk";
import mongoose from "mongoose";

import Post from "../models/post.model.js";
import {
  isFileTypeSupported,
  uploadFileToCloudinary,
} from "../utils/helpers.utils.js";
export const addPostController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { description } = req.body;
    // check if both description and image unavailable
    if (!req.file && (!description || description.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Either image or description is required to Post",
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
    // create a new post
    const newPost = await Post.create({
      user: userId,
      description: description || "",
      postImage: imageUrl || "",
    });
    await newPost.populate("user", "fullName headline profilePic");
    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in addNewPostController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in addNewPostController in post.controller.js",
    });
  }
};

// like and dislike in one controller function
export const likeDislikeController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "User not found",
      });
    const { postId } = req.body;
    // check if postId is valid
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        error: "Post not found",
      });
    }
    // check if userId is already present in post's likes, if present than remove otherwise add
    const index = post.likes.findIndex((id) => id.equals(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    return res.status(200).json({
      success: true,
      message: `${index === -1 ? "Post liked" : "Like removed"}`,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in likeDislikeController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in likeDislikeController in post.controller.js",
    });
  }
};

// all user's posts
export const getAllPostController = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({
        path: "comments",
        populate: { path: "user", select: "fullName profilePic headline" },
      });

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      allPosts: post,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in getAllPostController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getAllPostController in post.controller.js",
    });
  }
};

// get post by id
export const getPostByIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        error: "PostId incorrect or not found",
      });
    }
    const post = await Post.findById(postId).populate("user", "-password");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        error: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post fetched by id successfullly",
      post,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in getPostByIdController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getPostByIdController in post.controller.js",
    });
  }
};

// get top 5 posts. userId passed in params
export const getTop5PostsController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "userId Invalid" });
    }
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "userId not found",
        error: "userId not found",
      });
    }
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName profilePic headline");
    return res.status(200).json({
      success: true,
      message: "Top 5 Posts fetched successfully",
      posts,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in getTop5PostsController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getTop5PostsController in post.controller.js",
    });
  }
};

// get all post ofr user
export const getAllPostOfUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "userId Invalid" });
    }
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "userId not found",
        error: "userId not found",
      });
    }
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "profilePic headline about fullName");
    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      posts,
    });
  } catch (error) {
    // Handle  errors
    console.log(
      chalk.bgRedBright(
        "Error in getAllPostOfUserController in post.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in getAllPostOfUserController in post.controller.js",
    });
  }
};
