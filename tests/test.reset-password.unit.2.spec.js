const { VerificationType } = require("../src/utils/enums");
const bcrypt = require("bcrypt");

jest.mock("../src/verification/service.js");
jest.mock("../src/utils/mailer.js");
jest.mock("../src/verification/repository.js");
jest.mock("../src/user/repository.js");

describe("Reset Password flow 2 unit tests", () => {
    describe("VerificationHandler", () => {
        const VerificationHandler = jest.requireActual(
            "../src/verification/handlers.js"
        );
        const VerificationService = jest.requireMock(
            "../src/verification/service.js"
        );

        describe("verifyPasswordResetVerification(req, res, next)", () => {
            const email = "email";
            const passwordResetCode = "passwordResetCode";
            const body = { email, passwordResetCode };
            const req = { body };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            const passwordResetToken = "passwordResetToken";
            VerificationService.validatePasswordResetCode.mockResolvedValue(
                passwordResetToken
            );

            beforeAll(async () => {
                await VerificationHandler.verifyPasswordResetVerification(
                    req,
                    res,
                    next
                );
            });

            it("Should respond with a status code of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it("Should respond with a passwordResetToken", () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    passwordResetToken,
                });
            });

            it("Should call VerificationService.validatePasswordResetCode once", () => {
                expect(
                    VerificationService.validatePasswordResetCode
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call VerificationService.validatePasswordResetCode with passwordResetCode and email", () => {
                expect(
                    VerificationService.validatePasswordResetCode
                ).toHaveBeenCalledWith(passwordResetCode, email);
            });
        });
    });

    describe("VerificationService", () => {
        const VerificationService = jest.requireActual(
            "../src/verification/service.js"
        );
        const VerificationRepository = jest.requireMock(
            "../src/verification/repository.js"
        );
        const UserRepository = jest.requireMock("../src/user/repository.js");

        describe("validatePasswordResetCode(passwordResetCode, email)", () => {
            const passwordResetCode = "passwordResetCode";
            const email = "email";
            const user = { _id: "id" };
            const userId = user._id;
            UserRepository.readByEmail.mockResolvedValue(user);
            const verificationId = "id";
            VerificationRepository.deleteById.mockImplementation(
                (verificationId) => {}
            );

            beforeAll(async () => {
                const verificationCode = await bcrypt.hash(
                    passwordResetCode,
                    10
                );
                const verification = { _id: verificationId, verificationCode };
                VerificationRepository.getVerificationByUserId.mockResolvedValue(
                    verification
                );

                await VerificationService.validatePasswordResetCode(
                    passwordResetCode,
                    email
                );
            });

            it("Should call VerificationRepository.deleteById once with verificationId", () => {
                expect(VerificationRepository.deleteById).toHaveBeenCalledTimes(
                    1
                );
                expect(VerificationRepository.deleteById).toHaveBeenCalledWith(
                    verificationId
                );
            });

            it("Should call VerificationRepository.getVerificationByUserId once with userId", () => {
                expect(
                    VerificationRepository.getVerificationByUserId
                ).toHaveBeenCalledTimes(1);
                expect(
                    VerificationRepository.getVerificationByUserId
                ).toHaveBeenCalledWith(userId);
            });

            it("Should call UserRepository.readByEmail once with email", () => {
                expect(UserRepository.readByEmail).toHaveBeenCalledTimes(1);
                expect(UserRepository.readByEmail).toHaveBeenCalledWith(email);
            });
        });
    });
});
