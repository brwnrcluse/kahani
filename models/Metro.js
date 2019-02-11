const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const metroSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    line: { type: Number, required: true },
    location: { type: [Number], required: true }
  },
  {
    timestamps: true
  }
);

const Metro = mongoose.model("Metro", metroSchema);

module.exports = Metro;
