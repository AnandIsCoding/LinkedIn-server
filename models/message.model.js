import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    // ✅ TTL expiry field (automatically deletes after 30 days)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      expires: 0, // TTL activates here
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Custom validator to ensure either message or image is present
messageSchema.pre("validate", function (next) {
  if (!this.message && !this.image) {
    return next(new Error("Either message or image is required."));
  }
  next();
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;

// conversationId ==> ID of the conversation to which this message belongs
// sender ==> 	ID of the user who sent the message
// message ==>  Text content of the message
// image ==>    Image URL if the message contains an image

//  the pre("validate") hook is a middleware function that runs before validation happens on a document (e.g. before .save()).

// It gives you a chance to add custom validation logic that Mongoose wouldn't handle by default.
