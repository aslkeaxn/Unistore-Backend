const UserRepository = require("../user/repository");
const { Errors, MessageStatus } = require("../utils/enums");
const { raiseError } = require("../utils/helper");
const ConversationRepository = require("./conversation.repository");
const MessageRepository = require("./message.repository");
const Filter = require('bad-words');

const filter = new Filter();

async function sendMessage(message) {
    const { senderId, receiverId, text } = message;
    const trimmedText = text.trim();
    message.text = filter.clean(trimmedText);


    if (senderId === receiverId) {
        raiseError(
            401,
            "Attempted to message oneself",
            Errors.UnauthorizedActionError
        );
    }

    if (!text || text.length < 1) {
        raiseError(
            400,
            "Did not provide message body",
            Errors.MessageTextMissing
        );
    }

    const receiver = await UserRepository.getUser(receiverId);

    if (!receiver) {
        raiseError(404, "The message receiver doesn't exist", Errors);
    }

    let conversation = await ConversationRepository.readByUserIds(
        senderId,
        receiverId
    );

    if (!conversation) {
        conversation = { userIdA: senderId, userIdB: receiverId };
        conversation = await ConversationRepository.createConversation(
            conversation
        );
    }

    const { _id: conversationId } = conversation;
    message.conversationId = conversationId;

    await MessageRepository.createMessage(message);
}

async function readConversation(userId, interlocutorId) {
    if (userId === interlocutorId) {
        raiseError(
            401,
            "Attempted to read conversation with oneself",
            Errors.UnauthorizedActionError
        );
    }

    return await MessageRepository.readByUserIds(userId, interlocutorId);
}

async function readConversations(userId) {
    const conversations = await ConversationRepository.readAllByUserId(userId);

    const detailedConversations = [];

    for (let conversation of conversations) {
        const interlocutorId =
            userId === conversation.userIdA.toString()
                ? conversation.userIdB
                : conversation.userIdA;

        const interlocutorUsername = await UserRepository.readUsername(
            interlocutorId
        );

        const { _id: conversationId } = conversation;

        const unreadMessagesCount =
            await MessageRepository.countUnreadMessagesByConversationId(
                conversationId,
                userId
            );

        const lastMessage =
            await MessageRepository.readLastMessageByConversationId(
                conversationId
            );

        conversation = {
            interlocutorId,
            interlocutorUsername,
            lastMessage,
            unreadMessagesCount,
        };

        detailedConversations.push(conversation);
    }

    return detailedConversations;
}

async function readUnreadMessagesCount(userId) {
    const unreadMessagesCount = await MessageRepository.countUnreadMessages(
        userId
    );

    return unreadMessagesCount;
}

async function updateMessageStatus(userId, messageId) {
    const message = await MessageRepository.readById(messageId);

    if (!message) {
        raiseError(404, "Message does not exist", Errors.MessageNotFound);
    }

    if (userId !== message.receiverId.toString()) {
        raiseError(
            401,
            "Attempted to update message status",
            Errors.UnauthorizedActionError
        );
    }

    await MessageRepository.updateStatusById(messageId, MessageStatus.Read);
}

const ChatService = {
    sendMessage,
    readConversation,
    readConversations,
    readUnreadMessagesCount,
    updateMessageStatus,
};

module.exports = ChatService;
