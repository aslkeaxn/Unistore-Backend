const mongoose = require("mongoose");
const { MessageStatus } = require("../utils/enums");

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: Object.keys(MessageStatus),
        default: MessageStatus.Sent,
    },
    date: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
