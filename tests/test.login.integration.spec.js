const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/model");
const { UserType } = require("../src/utils/enums");
const bcrypt = require("bcrypt");

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Login integration test", () => {
    const email = "sc1908360@qu.edu.qa";
    const password = "123456";
    const params = {};

    beforeAll(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            type: UserType.Student,
            username: "johnny",
            email,
            password: await bcrypt.hash(password, 10),
            phoneNumber: "55555555",
            verified: true,
        });

        const res = await request(app).post("/api/auth/signIn").send({
            email,
            password,
        });

        params.res = res;
    });

    it("Should respond with a status code of 200", () => {
        expect(params.res.status).toBe(200);
    });
});
