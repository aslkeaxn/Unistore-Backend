const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/model");
const bcrypt = require("bcrypt");
const { UserType } = require("../src/utils/enums");
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

describe("Reset Password flow 3 integration test", () => {
    const params = {};
    const email = "sc1908360@qu.edu.qa";
    const token = JWT.sign({ email });
    const newPassword = "456789";

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

        params.oldPasswordHash = user.password;

        const res = await request(app)
            .put("/api/users/password-reset")
            .set("Authorization", `Bearer ${token}`)
            .send({ password: newPassword });

        params.res = res;

        const updatedUser = await User.findById(userId);

        params.updatedUser = updatedUser;
    });

    it("Should respond with a status code of 200", () => {
        expect(params.res.status).toBe(200);
    });

    it("Should have updated the user's data with the new password", async () => {
        expect(params.updatedUser.password).not.toBe(params.oldPasswordHash);
    });
});
