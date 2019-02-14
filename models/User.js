const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    encryptedPassword: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    },
    collected: [{ type: Schema.Types.ObjectId, ref: "Metro", unique: true }],
    challenges_active: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
    challenges_completed: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
    challenges_queued: [{ type: Schema.Types.ObjectId, ref: "Challenge" }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
