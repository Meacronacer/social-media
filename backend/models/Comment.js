const { Schema, model } = require("mongoose");

const Comment = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

module.exports = model("Comment", Comment);
