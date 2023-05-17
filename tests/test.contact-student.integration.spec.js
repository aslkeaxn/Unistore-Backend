const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcrypt");
const { UserType } = require("../src/utils/enums");
const User = require("../src/user/model");
const Message = require("../src/chat/message.model");
const mongoose = require("mongoose");

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Contact Student integration test", () => {
    const params = {};
    const senderId = new mongoose.Types.ObjectId().toString();
    const senderFirstName = "John";
    const receiverId = new mongoose.Types.ObjectId().toString();
    const receiverFirstName = "Jane";
    const text = "Hello, world!";

    beforeAll(async () => {
        const password = "123456";

        const sender = await User.create({
            _id: senderId,
            firstName: senderFirstName,
            lastName: "Doe",
            type: UserType.Student,
            username: "johnny",
            email: "sc1908360@qu.edu.qa",
            password: await bcrypt.hash(password, 10),
            phoneNumber: "55555555",
            verified: true,
        });

        const receiver = await User.create({
            _id: receiverId,
            firstName: receiverFirstName,
            lastName: "Doe",
            type: UserType.Student,
            username: "jannie",
            email: "janniehopefullynotreal@qu.edu.qa",
            password: await bcrypt.hash(password, 10),
            phoneNumber: "55555550",
            verified: true,
        });

        const res1 = await request(app).post("/api/auth/signIn").send({
            email: sender.email,
            password: password,
        });

        const authToken = res1.body.userToken;

        const res2 = await request(app)
            .post(`/api/chat/${receiverId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({ text });

        params.res = res2;

        const message = await Message.findOne({ senderId, receiverId });

        params.message = message;
    });

    test("Should respond with status 200", async () => {
        expect(params.res.status).toBe(200);
    });

    it(`Should create a message from ${senderFirstName} to ${receiverFirstName}`, async () => {
        const message = params.message;
        expect(message.senderId.toString()).toBe(senderId);
        expect(message.receiverId.toString()).toBe(receiverId);
    });

    it(`Should create a message with text = "${text}"`, async () => {
        const message = params.message;
        expect(message.text).toBe(text);
    });
});
