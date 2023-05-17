const { VerificationType } = require("../src/utils/enums");
const { sendMail } = require("../src/utils/mailer");
const bcrypt = require("bcrypt");

jest.mock("../src/user/service.js");
jest.mock("../src/verification/service.js");
jest.mock("../src/utils/mailer.js");
jest.mock("../src/user/repository.js");
jest.mock("../src/verification/repository.js");

describe("Registration flow 1 unit tests", () => {
    describe("UserHandler", () => {
        const UserHandler = jest.requireActual("../src/user/handlers.js");
        const UserService = jest.requireMock("../src/user/service.js");
        const VerificationService = jest.requireMock(
            "../src/verification/service.js"
        );
        const Mailer = jest.requireMock("../src/utils/mailer.js");

        describe("createUser(req, res, next)", () => {
            const user = {
                firstName: "john",
                lastName: "doe",
                email: "johndoe@gmail.com",
                password: "123456",
                username: "johnny",
                phoneNumber: "55555555",
                type: "Student",
            };

            const req = { body: user };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            const userId = "userId";
            const verificationCode = "verificationCode";
            const email = user.email;
            const message = "A verification code has been sent to your email";

            UserService.createUser.mockResolvedValue(userId);
            VerificationService.createVerificationCode.mockResolvedValue(
                verificationCode
            );
            Mailer.sendEmailVerificationMail.mockResolvedValue({});

            beforeAll(async () => {
                await UserHandler.createUser(req, res, next);
            });

            it("Calls UserService.createUser once with the user object", () => {
                expect(UserService.createUser).toHaveBeenCalledTimes(1);
                expect(UserService.createUser).toHaveBeenCalledWith(user);
            });

            it("Calls VerificationService.createVerificationCode once with userId and the verification type", () => {
                expect(
                    VerificationService.createVerificationCode
                ).toHaveBeenCalledTimes(1);
                expect(
                    VerificationService.createVerificationCode
                ).toHaveBeenCalledWith(userId, VerificationType.Email);
            });

            it("Calls Mailer.sendEmailVerificationMail once with email and verificationCode", () => {
                expect(Mailer.sendEmailVerificationMail).toHaveBeenCalledTimes(
                    1
                );
                expect(Mailer.sendEmailVerificationMail).toHaveBeenCalledWith(
                    email,
                    verificationCode
                );
            });

            it("Responds with a status of 201", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(201);
            });

            it(`Responds with the message: ${message}`, () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({ message });
            });
        });
    });

    describe("UserService", () => {
        const UserService = jest.requireActual("../src/user/service.js");
        const UserRepository = jest.requireMock("../src/user/repository.js");

        describe("createUser(user)", () => {
            const user = {
                firstName: "john",
                lastName: "doe",
                email: "randomemailpls@qu.edu.qa",
                password: "123456",
                username: "johnny",
                phoneNumber: "55555555",
                type: "Student",
            };

            const newUser = { _id: "_id" };

            UserRepository.create.mockResolvedValue(newUser);

            const params = {};

            beforeAll(async () => {
                const result = await UserService.createUser(user);
                params.result = result;
            });

            it("Should call UserRepository.create once", () => {
                expect(UserRepository.create).toHaveBeenCalledTimes(1);
            });

            it("Should call UserRepository.create with user", () => {
                expect(UserRepository.create).toHaveBeenCalledWith(user);
            });

            it("Should return the _id property of the created user", () => {
                const result = params.result;
                expect(result).toEqual(newUser._id);
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

        describe("createVerificationCode(userId, verificationType)", () => {
            const userId = "userId";
            const verificationType = VerificationType.Email;

            const params = {};

            beforeAll(async () => {
                const verificationCode =
                    await VerificationService.createVerificationCode(
                        userId,
                        verificationType
                    );

                params.verificationCode = verificationCode;
            });

            it("Should call VerificationRepository.create once", () => {
                expect(VerificationRepository.create).toHaveBeenCalledTimes(1);
            });

            it("Should return a 6 characters hexadecimal string", () => {
                const verificationCode = params.verificationCode;
                expect(verificationCode.length).toBe(6);
            });
        });
    });

    describe("Mailer", () => {
        const Mailer = jest.requireActual("../src/utils/mailer.js");
        const sendSpy = jest
            .spyOn(Mailer, "sendMail")
            .mockImplementation((email, code) => {});

        describe("sendEmailVerificationMail(email, code)", () => {
            const email = "johndoe@gmail.com";
            const code = "aaaaaa";

            beforeAll(async () => {
                await Mailer.sendEmailVerificationMail(email, code);
            });

            it("Should call sendMail once", () => {
                expect(sendSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
