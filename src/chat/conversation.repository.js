const Conversation = require("./conversation.model");

async function createConversation(conversation) {
    return await Conversation.create(conversation);
}

async function readByUserIds(senderId, receiverId) {
    return await Conversation.findOne({
        $or: [
            { userIdA: senderId, userIdB: receiverId },
            { userIdA: receiverId, userIdB: senderId },
        ],
    });
}

async function readAllByUserId(userId) {
    return await Conversation.find({
        $or: [{ userIdA: userId }, { userIdB: userId }],
    });
}

const ConversationRepository = {
    createConversation,
    readByUserIds,
    readAllByUserId,
};

module.exports = ConversationRepository;
