const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/model");
const bcrypt = require("bcrypt");
const { UserType } = require("../src/utils/enums");
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

describe("Reset Password flow 1 integration test", () => {
    const params = {};
    const email = "sc1908360@qu.edu.qa";

    beforeAll(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            type: UserType.Student,
            username: "johnny",
            email,
            password: await bcrypt.hash("123456", 10),
            phoneNumber: "55555555",
            verified: true,
        });

        const userId = user._id.toString();

        const res = await request(app)
            .post("/api/verification/password-reset-verification")
            .send({ email });

        params.res = res;

        const verifications = await Verification.find({ userId });

        params.verifications = verifications;
    });

    it("Should respond with a status code of 200", () => {
        expect(params.res.status).toBe(200);
    });

    it('Should respond with the following message: "A verification code has been sent to your email."', () => {
        expect(params.res.body).toEqual({
            message: "A verification code has been sent to your email.",
        });
    });

    it("Should create a password verification for the user", () => {
        expect(params.verifications.length).toBe(1);
    });
});
