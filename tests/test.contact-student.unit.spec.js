jest.mock("../src/chat/service.js");
jest.mock("../src/user/repository.js");
jest.mock("../src/chat/conversation.repository.js");
jest.mock("../src/chat/message.repository.js");

describe("Contact Student unit tests", () => {
    describe("ChatHandler", () => {
        const ChatHandler = jest.requireActual("../src/chat/handlers");
        const ChatService = jest.requireMock("../src/chat/service.js");

        describe("sendMessage(req, res, next)", () => {
            const userId = "test-user-id";
            const receiverId = "test-receiver-id";
            const text = "test-message";

            const req = {
                decodedToken: { userId },
                params: { receiverId },
                body: { text },
            };

            const res = {
                status: jest.fn(),
            };

            const next = jest.fn();

            beforeEach(() => {
                jest.clearAllMocks();
            });

            it("Should call ChatService.sendMessage once", async () => {
                await ChatHandler.sendMessage(req, res, next);
                expect(ChatService.sendMessage).toHaveBeenCalledTimes(1);
            });

            it("Should call ChatService.sendMessage with a message object", async () => {
                await ChatHandler.sendMessage(req, res, next);
                expect(ChatService.sendMessage).toHaveBeenCalledWith({
                    senderId: userId,
                    receiverId,
                    text,
                });
            });

            it("Should respond with a status of 200", async () => {
                await ChatHandler.sendMessage(req, res, next);
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });
    });

    describe("ChatService", () => {
        const ChatService = jest.requireActual("../src/chat/service.js");
        const UserRepository = jest.requireMock("../src/user/repository.js");
        const ConversationRepository = jest.requireMock(
            "../src/chat/conversation.repository.js"
        );
        const MessageRepository = jest.requireMock(
            "../src/chat/message.repository.js"
        );

        describe("sendMessage({ senderId, receiverId, text })", () => {
            const senderId = "test-sender-id";
            const receiverId = "test-receiver-id";
            const text = "test-message";
            const message = { senderId, receiverId, text };

            beforeEach(() => {
                jest.clearAllMocks();
                UserRepository.getUser.mockResolvedValue({});
                ConversationRepository.readByUserIds.mockResolvedValue({
                    _id: "123",
                });
                MessageRepository.createMessage.mockResolvedValue({});
            });

            it("Should call UserRepository.getUser once", async () => {
                await ChatService.sendMessage(message);
                expect(UserRepository.getUser).toHaveBeenCalledTimes(1);
            });

            it("Should call UserRepository.getUser with receiverId", async () => {
                await ChatService.sendMessage(message);
                expect(UserRepository.getUser).toHaveBeenCalledWith(receiverId);
            });

            it("Should call ConversationRepository.readByUserIds once", async () => {
                await ChatService.sendMessage(message);
                expect(
                    ConversationRepository.readByUserIds
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call ConversationRepository.readByUserIds with senderId and receiverId", async () => {
                await ChatService.sendMessage(message);
                expect(
                    ConversationRepository.readByUserIds
                ).toHaveBeenCalledWith(senderId, receiverId);
            });

            it("Should call MessageRepository.createMessage once", async () => {
                await ChatService.sendMessage(message);
                expect(MessageRepository.createMessage).toHaveBeenCalledTimes(
                    1
                );
            });

            it("Should call MessageRepository.createMessage with message", async () => {
                await ChatService.sendMessage(message);
                expect(MessageRepository.createMessage).toHaveBeenCalledWith(
                    message
                );
            });
        });
    });
});
