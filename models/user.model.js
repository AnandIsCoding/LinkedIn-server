import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // <-- allows multiple null/undefined values
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // If a user logs in via Google (googleId), they may not have a password. In that case false otherwise true
      },
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dm0rlehq8/image/upload/v1751560449/default_user_sij8ek.jpg",
    },
    profileBanner: {
      type: String,
      default:
        "https://res.cloudinary.com/dm0rlehq8/image/upload/v1750167749/default_banner_r0agoh.jpg",
    },
    about: {
      type: String,
      default: "",
      trim: true,
    },
    headline: {
      type: String,
      default: "",
      trim: true,
    },
    currentCompany: {
      type: String,
      default: "",
    },
    currentLocation: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resume: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        designation: {
          type: String,
        },
        companyName: {
          type: String,
        },
        duration: {
          type: String,
        },
        location: {
          type: String,
        },
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({ googleId: 1, email: 1 }, { unique: true, sparse: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
