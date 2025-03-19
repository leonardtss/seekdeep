const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  title: {type:String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", ConversationSchema);