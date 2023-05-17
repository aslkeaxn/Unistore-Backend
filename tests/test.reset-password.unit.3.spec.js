const { VerificationType, UpdatePasswordType } = require("../src/utils/enums");
const bcrypt = require("bcrypt");

jest.mock("../src/user/service.js");
jest.mock("../src/user/repository.js");

describe("Reset Password flow 3 unit tests", () => {
    describe("UserHandler", () => {
        const UserHandler = jest.requireActual("../src/user/handlers.js");
        const UserService = jest.requireMock("../src/user/service.js");

        describe("resetPassword(req, res, next)", () => {
            const email = "email";
            const decodedToken = { email };
            const password = "password";
            const body = { password };
            const req = { decodedToken, body };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            UserService.resetPassword.mockImplementation(
                (email, password) => {}
            );

            beforeAll(async () => {
                await UserHandler.resetPassword(req, res, next);
            });

            it("Should call UserService.resetPassword once with email and password", () => {
                expect(UserService.resetPassword).toHaveBeenCalledTimes(1);
                expect(UserService.resetPassword).toHaveBeenCalledWith(
                    email,
                    password
                );
            });

            it("Should respond with a status code of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });
    });

    describe("UserService", () => {
        const UserService = jest.requireActual("../src/user/service.js");
        const UserRepository = jest.requireMock("../src/user/repository.js");

        describe("resetPassword(email, password)", () => {
            const email = "email";
            const password = "password";
            const validatePassword = jest.spyOn(
                UserService,
                "validatePassword"
            );
            const hashedPassword = "hashedPassword";
            const hashPassword = jest
                .spyOn(UserService, "hashPassword")
                .mockResolvedValue(hashedPassword);
            UserRepository.updatePassword.mockImplementation(
                (email, hashedPassword, updatePasswordType) => {}
            );

            beforeAll(async () => {
                await UserService.resetPassword(email, password);
            });

            it("Should call UserService.validatePassword once with password", () => {
                expect(validatePassword).toHaveBeenCalledTimes(1);
                expect(validatePassword).toHaveBeenCalledWith(password);
            });

            it("Should call UserService.hashPassword once with password", () => {
                expect(hashPassword).toHaveBeenCalledTimes(1);
                expect(hashPassword).toHaveBeenCalledWith(password);
            });

            it("Should call UserRepository.updatePassword once", () => {
                expect(UserRepository.updatePassword).toHaveBeenCalledTimes(1);
            });

            it("Should call UserRepository.updatePassword with email, hashedPassword, and UpdatePasswordType.Email", () => {
                expect(UserRepository.updatePassword).toHaveBeenCalledWith(
                    email,
                    hashedPassword,
                    UpdatePasswordType.Email
                );
            });
        });
    });
});
