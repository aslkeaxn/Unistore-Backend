const ChatService = require("./service");

async function sendMessage(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { receiverId } = req.params;
        const { text } = req.body;

        const message = { senderId: userId, receiverId, text };
        await ChatService.sendMessage(message);

        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}

async function readConversation(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { interlocutorId } = req.params;

        const conversation = await ChatService.readConversation(
            userId,
            interlocutorId
        );

        res.json({ conversation });
    } catch (error) {
        next(error);
    }
}

async function readConversations(req, res, next) {
    try {
        const { userId } = req.decodedToken;

        const conversations = await ChatService.readConversations(userId);

        res.json({ conversations });
    } catch (error) {
        next(error);
    }
}

async function readUnreadMessagesCount(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const unreadMessagesCount = await ChatService.readUnreadMessagesCount(
            userId
        );
        res.json({ unreadMessagesCount });
    } catch (error) {
        next(error);
    }
}

async function updateMessageStatus(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { messageId } = req.params;
        await ChatService.updateMessageStatus(userId, messageId);
        res.json({});
    } catch (error) {
        next(error);
    }
}

const ChatHandlers = {
    sendMessage,
    readConversation,
    readConversations,
    readUnreadMessagesCount,
    updateMessageStatus,
};

module.exports = ChatHandlers;
