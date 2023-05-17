const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userIdA: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userIdB: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
