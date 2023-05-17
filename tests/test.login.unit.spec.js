const bcrypt = require("bcrypt");

jest.mock("../src/auth/service.js");
jest.mock("../src/user/repository.js");

describe("Login unit tests", () => {
    describe("AuthHandler", () => {
        const AuthHandler = jest.requireActual("../src/auth/handlers.js");
        const AuthService = jest.requireMock("../src/auth/service.js");

        describe("signInUser(req, res, next)", () => {
            const email = "email";
            const password = "password";
            const req = { body: { email, password } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const next = jest.fn();
            const userToken = "userToken";
            AuthService.signInUser.mockResolvedValue(userToken);

            beforeAll(async () => {
                await AuthHandler.signInUser(req, res, next);
            });

            it("Should call AuthService.signInUser once", () => {
                expect(AuthService.signInUser).toHaveBeenCalledTimes(1);
            });

            it("Should call AuthService.signInUser with email and password", () => {
                expect(AuthService.signInUser).toHaveBeenCalledWith(
                    email,
                    password
                );
            });

            it("Should respond with a status of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it("Should respond with a userToken", () => {
                expect(res.json).toHaveBeenCalledWith({ userToken });
            });
        });
    });

    describe("AuthService", () => {
        const AuthService = jest.requireActual("../src/auth/service.js");
        const UserRepository = jest.requireMock("../src/user/repository.js");

        describe("signInUser(email, password)", () => {
            const email = "email";
            const password = "password";
            const _id = "_id";
            const verified = true;
            const user = { _id, verified };
            const params = {};

            beforeAll(async () => {
                user.password = await bcrypt.hash(password, 10);
                UserRepository.readByEmail.mockResolvedValue(user);
                await AuthService.signInUser(email, password);
            });

            it("Should call UserRepository.readByEmail once", () => {
                expect(UserRepository.readByEmail).toHaveBeenCalledTimes(1);
            });

            it("Should call UserRepository.readByEmail with email", () => {
                expect(UserRepository.readByEmail).toHaveBeenCalledWith(email);
            });
        });
    });
});
