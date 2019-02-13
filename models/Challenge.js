const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const challengeSchema = new Schema(
  {
    type: { type: String, required: true },
    pictureUrl: { type: File, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);
const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
