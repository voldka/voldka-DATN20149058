const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: { type: String },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
      default: "",
    },
    address: { type: String },
    city: { type: String },

    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: String,
      default: "",
    },
    isAdmin: { type: Boolean, default: false, required: true },
    role: {
      type: String,
      enum: ["general", "moderator", "admin"],
      default: "general",
    },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text" });
module.exports = mongoose.model("User", userSchema);
