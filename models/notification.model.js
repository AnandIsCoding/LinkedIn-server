import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      enum: ["friendRequest", "comment", "like", "follow", "mention"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    link: {
      type: String,
      default: "", // e.g. '/post/123' or '/profile/abc'
    },
  },
  { timestamps: true }
);

notificationSchema.index({ receiver: 1, isRead: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
export default Notification;

// sender ==> The user who triggered the notification (e.g., sent a request, commented).
// receiver ==> The user who receives the notification.
// content ==> The main text content/message of the notification.
// notificationType ==> 	Type of notification. Must be one of: friendrequest, comment. like, follow, mention
// isRead ==> Indicates whether the notification has been read. Defaults to false.
// postId ==> 	ID of the related post if applicable (e.g., for comment notifications).
