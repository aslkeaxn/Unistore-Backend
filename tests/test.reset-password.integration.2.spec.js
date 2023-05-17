const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/model");
const bcrypt = require("bcrypt");
const { UserType, VerificationType } = require("../src/utils/enums");
const Verification = require("../src/verification/model");
const JWT = require("../src/utils/jwt");

jest.setTimeout(10000);

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Reset Password flow 2 integration test", () => {
    const params = {};
    const email = "sc1908360@qu.edu.qa";
    const verificationCode = "aaaaaa";

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

        const verification = await Verification.create({
            type: VerificationType.PasswordReset,
            userId,
            verificationCode: await bcrypt.hash(verificationCode, 10),
        });

        const res = await request(app)
            .post("/api/verification/password-reset-verification-confirm")
            .send({ email, passwordResetCode: verificationCode });

        params.res = res;
    });

    it("Should respond with a status code of 200", () => {
        expect(params.res.status).toBe(200);
    });

    it("Should respond with a valid passwordResetToken", () => {
        const token = params.res.body.passwordResetToken;
        expect(JWT.verify(token).email).toEqual(email);
    });
});
