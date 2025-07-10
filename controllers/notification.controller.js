import Notification from "../models/notification.model.js";

// get all notifications of the logged in user
export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .populate("sender receiver");
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in getNotificationsController in notification.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error:
        "Error in getNotificationsController in notification.controller.js",
    });
  }
};

// active notifications receiver is loggedIn user
export const getActiveNotificationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.find({
      receiver: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender receiver");
    return res.status(200).json({
      success: true,
      message: "Active notifications fetched successfully",
      count: notification.length,
    });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in getActiveNotificationController in notification.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error:
        "Error in getActiveNotificationController in notification.controller.js",
    });
  }
};

export const updateIsReadController = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req?.user?._id;
    const notification = await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });
    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    const activeNotification = await Notification.find({
      receiver: userId,
      isRead: false,
    }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({
        success: true,
        message: "Notification read successfully",
        activeNotificationCount: activeNotification.length,
      });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in updateIsReadController in notification.controller.js ---->> ",
        error
      )
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in updateIsReadController in notification.controller.js",
    });
  }
};
