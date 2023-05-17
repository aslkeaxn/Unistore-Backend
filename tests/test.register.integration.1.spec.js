const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const { UserType } = require("../src/utils/enums");
const User = require("../src/user/model");
const Verification = require("../src/verification/model");

jest.setTimeout(10000);

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Register flow 1 integration test", () => {
    const params = {};
    const user = {
        firstName: "John",
        lastName: "Doe",
        email: "sc1908360@qu.edu.qa",
        username: "johnny",
        password: "123456",
        phoneNumber: "55555555",
        type: UserType.Student,
    };

    beforeAll(async () => {
        const res = await request(app).post("/api/users/").send(user);
        params.res = res;
    });

    it("Should respond with a status of 201", () => {
        expect(params.res.status).toBe(201);
    });

    it('Should respond with "A verification code has been sent to your email"', () => {
        expect(params.res.body).toEqual({
            message: "A verification code has been sent to your email",
        });
    });

    it("Should create a verification for the user", async () => {
        const dbUser = await User.findOne({ email: user.email });
        const userId = dbUser._id;
        const verification = await Verification.findOne({ userId });
        expect(verification).not.toBe(null);
    });
});
