const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcrypt");
const User = require("../src/user/model");
const Verification = require("../src/verification/model");
const { UserType, VerificationType } = require("../src/utils/enums");

jest.setTimeout(10000);

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Register flow 2 integration test", () => {
    const registrationVerificationCode = "aaaaaa";
    const email = "sc1908360@qu.edu.qa";
    const params = {};

    beforeAll(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            type: UserType.Student,
            username: "johnny",
            email,
            password: await bcrypt.hash("123456", 10),
            phoneNumber: "55555555",
            verified: false,
        });

        await Verification.create({
            userId: user._id.toString(),
            type: VerificationType.Email,
            verificationCode: await bcrypt.hash(
                registrationVerificationCode,
                10
            ),
        });

        const res = await request(app)
            .post("/api/verification/registration-verification")
            .send({ registrationVerificationCode, email });

        params.res = res;

        const dbUser = await User.findById(user._id.toString());

        params.user = dbUser;
    });

    it("Should respond with a status code of 200", () => {
        expect(params.res.status).toBe(200);
    });

    it("Should have set the verified field of the user to true", () => {
        expect(params.user.verified).toBe(true);
    });
});
