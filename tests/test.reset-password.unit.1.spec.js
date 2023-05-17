const { VerificationType } = require("../src/utils/enums");

jest.mock("../src/verification/service.js");
jest.mock("../src/utils/mailer.js");
jest.mock("../src/verification/repository.js");
jest.mock("../src/user/repository.js");

describe("Reset Password flow 1 unit tests", () => {
    describe("VerificationHandler", () => {
        const VerificationHandler = jest.requireActual(
            "../src/verification/handlers.js"
        );
        const VerificationService = jest.requireMock(
            "../src/verification/service.js"
        );
        const Mailer = jest.requireMock("../src/utils/mailer.js");

        describe("createPasswordResetVerification(req, res, next)", () => {
            const email = "email";
            const body = { email };
            const req = { body };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            const verificationCode = "verificationCode";
            VerificationService.createPasswordResetVerification.mockResolvedValue(
                verificationCode
            );
            Mailer.sendPasswordVerificationEmail.mockImplementation(
                (email, verificationCode) => {}
            );

            beforeAll(async () => {
                await VerificationHandler.createPasswordResetVerification(
                    req,
                    res,
                    next
                );
            });

            it("Should respond with a status code of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it("Should respond with the following message: A verification code has been sent to your email.", () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    message: "A verification code has been sent to your email.",
                });
            });

            it("Should call Mailer.sendPasswordVerificationEmail once", () => {
                expect(
                    Mailer.sendPasswordVerificationEmail
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call Mailer.sendPasswordVerificationEmail with email and verificationCode", () => {
                expect(
                    Mailer.sendPasswordVerificationEmail
                ).toHaveBeenCalledWith(email, verificationCode);
            });

            it("Should call VerificationService.createPasswordResetVerification once", () => {
                expect(
                    VerificationService.createPasswordResetVerification
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call VerificationService.createPasswordResetVerification with email", () => {
                expect(
                    VerificationService.createPasswordResetVerification
                ).toHaveBeenCalledWith(email);
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

        describe("createPasswordResetVerification(email)", () => {
            const email = "email";
            const user = { _id: "id" };
            UserRepository.readByEmail.mockResolvedValue(user);
            const userId = user._id;
            const verification = {};
            VerificationRepository.getVerificationByUserId.mockResolvedValue(
                verification
            );
            const createVerificationCode = jest
                .spyOn(VerificationService, "createVerificationCode")
                .mockImplementation((userId, verificationType) => {});

            beforeAll(async () => {
                await VerificationService.createPasswordResetVerification(
                    email
                );
            });

            it("Should call VerificationService.createVerificationCode once with userId and VerificationType.PasswordReset", () => {
                expect(createVerificationCode).toHaveBeenCalledTimes(1);
                expect(createVerificationCode).toHaveBeenCalledWith(
                    userId,
                    VerificationType.PasswordReset
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
