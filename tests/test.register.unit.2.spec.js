const bcrypt = require("bcrypt");

jest.mock("../src/user/service.js");
jest.mock("../src/verification/service.js");
jest.mock("../src/user/repository.js");
jest.mock("../src/verification/repository.js");

describe("Registration flow 2 unit tests", () => {
    describe("VerificationHandler", () => {
        const VerificationHandler = jest.requireActual(
            "../src/verification/handlers.js"
        );
        const VerificationService = jest.requireMock(
            "../src/verification/service.js"
        );
        const UserService = jest.requireMock("../src/user/service.js");

        describe("createRegistrationVerification(req, res, next)", () => {
            const registrationVerificationCode = "aaaaaa";
            const email = "sc1908360@qu.edu.qa";

            const req = { body: { registrationVerificationCode, email } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            VerificationService.validateEmailVerification.mockImplementation(
                (email, registrationVerificationCode) => {}
            );
            UserService.verifyUser.mockImplementation((email) => {});

            beforeAll(async () => {
                await VerificationHandler.createRegistrationVerification(
                    req,
                    res,
                    next
                );
            });

            it("Should call VerificationService.validateEmailVerification once", () => {
                expect(
                    VerificationService.validateEmailVerification
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call VerificationService.validateEmailVerification with email and registrationVerificationCode", () => {
                expect(
                    VerificationService.validateEmailVerification
                ).toHaveBeenCalledWith(email, registrationVerificationCode);
            });

            it("Should call UserService.verifyUser once", () => {
                expect(UserService.verifyUser).toHaveBeenCalledTimes(1);
            });

            it("Should call UserService.verifyUser with email", () => {
                expect(UserService.verifyUser).toHaveBeenCalledWith(email);
            });

            it("Should respond with a status code of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });
    });

    describe("VerificationService", () => {
        const VerificationService = jest.requireActual(
            "../src/verification/service.js"
        );
        const UserRepository = jest.requireMock("../src/user/repository.js");
        const VerificationRepository = jest.requireMock(
            "../src/verification/repository.js"
        );

        describe("validateEmailVerification(email, registrationVerificationCode)", () => {
            const email = "sc1908360@qu.edu.qa";
            const registrationVerificationCode = "aaaaaa";
            const user = { _id: "_id" };
            const verification = { verificationCode: "" };

            UserRepository.readByEmail.mockResolvedValue(user);
            VerificationRepository.getVerificationByUserId.mockResolvedValue(
                verification
            );

            beforeAll(async () => {
                verification.verificationCode = await bcrypt.hash(
                    registrationVerificationCode,
                    10
                );

                await VerificationService.validateEmailVerification(
                    email,
                    registrationVerificationCode
                );
            });

            it("Should call UserRepository.readByEmail once", () => {
                expect(UserRepository.readByEmail).toHaveBeenCalledTimes(1);
            });

            it("Should call UserRepository.readByEmail with email", () => {
                expect(UserRepository.readByEmail).toHaveBeenCalledWith(email);
            });

            it("Should call VerificationRepository.getVerificationByUserId once", () => {
                expect(
                    VerificationRepository.getVerificationByUserId
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call VerificationRepository.getVerificationByUserId with user._id", () => {
                expect(
                    VerificationRepository.getVerificationByUserId
                ).toHaveBeenCalledWith(user._id);
            });
        });
    });
});
