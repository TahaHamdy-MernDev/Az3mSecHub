const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fristName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, max: 56, required: true, unique: true },
    password: { type: String, min: 6, max: 16, required: true },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
