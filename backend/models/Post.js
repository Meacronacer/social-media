const { Schema, model } = require("mongoose");

const Post = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, required: true, ref: "Comment" }],
  likes: [{ type: String, unique: true }],
  createAT: { type: Date, default: Date.now },
});

module.exports = model("Post", Post);
