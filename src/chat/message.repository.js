const { MessageStatus } = require("../utils/enums");
const Message = require("./message.model");

async function createMessage(message) {
    await Message.create(message);
}

async function readByUserIds(userId, interlocutorId) {
    return await Message.find({
        $or: [
            { senderId: userId, receiverId: interlocutorId },
            { senderId: interlocutorId, receiverId: userId },
        ],
    });
}

async function readLastMessageByConversationId(conversationId) {
    return (
        await Message.find({ conversationId }).sort({ date: -1 }).limit(1)
    )[0];
}

async function countUnreadMessages(receiverId) {
    return await Message.countDocuments({
        receiverId,
        status: MessageStatus.Sent,
    });
}

async function countUnreadMessagesByConversationId(conversationId, receiverId) {
    return await Message.countDocuments({
        conversationId,
        receiverId,
        status: MessageStatus.Sent,
    });
}

async function readById(messageId) {
    return await Message.findById(messageId);
}

async function updateStatusById(messageId, status) {
    await Message.findByIdAndUpdate(messageId, { status });
}

const MessageRepository = {
    createMessage,
    readByUserIds,
    countUnreadMessages,
    countUnreadMessagesByConversationId,
    readLastMessageByConversationId,
    readById,
    updateStatusById,
};

module.exports = MessageRepository;
