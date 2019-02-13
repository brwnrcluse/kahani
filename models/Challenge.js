const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const challengeSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["Metro", "History", "Test"] },
    challenge_icon: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "User" }],
    scoreboard: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);
const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
