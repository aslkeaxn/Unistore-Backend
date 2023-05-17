const express = require("express");
const ChatHandlers = require("./handlers");
const { extractToken } = require("../utils/middleware");

const router = express.Router();

router.post("/:receiverId", extractToken, ChatHandlers.sendMessage);

router.get("/", extractToken, ChatHandlers.readConversations);

router.get("/unread", extractToken, ChatHandlers.readUnreadMessagesCount);

router.get("/:interlocutorId", extractToken, ChatHandlers.readConversation);

router.patch(
    "/:messageId/update-status",
    extractToken,
    ChatHandlers.updateMessageStatus
);

module.exports = router;
