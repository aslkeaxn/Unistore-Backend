const VerificationService = require("../verification/service");
const UserService = require("./service");
const { VerificationType } = require("../utils/enums");
const Mailer = require("../utils/mailer");

async function createUser(req, res, next) {
    try {
        const {
            firstName,
            lastName,
            email,
            username,
            password,
            phoneNumber,
            type,
        } = req.body;

        const user = {
            firstName,
            lastName,
            email,
            password,
            username,
            phoneNumber,
            type,
        };

        const userId = await UserService.createUser(user);
        const verificationCode =
            await VerificationService.createVerificationCode(
                userId,
                VerificationType.Email
            );
        await Mailer.sendEmailVerificationMail(email, verificationCode);

        res.status(201).json({
            message: "A verification code has been sent to your email",
        });
    } catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    try {
        const { userId } = req.decodedToken;

        const user = await UserService.getUser(userId);

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

async function getPhoneNumber(req, res, next) {
    try {
        const { userId } = req.params;

        const phoneNumber = await UserService.getPhoneNumber(userId);

        res.json({ phoneNumber });
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const { userId } = req.decodedToken;

        const { firstName, lastName, phoneNumber, username, email } = req.body;
        const user = { firstName, lastName, phoneNumber, username, email };

        await UserService.updateUser(userId, user);

        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}

async function resetPassword(req, res, next) {
    try {
        const { email } = req.decodedToken;
        const { password } = req.body;
        await UserService.resetPassword(email, password);

        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}

async function updatePassword(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { password, newPassword } = req.body;

        await UserService.updatePassword(userId, password, newPassword);

        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    updateUser,
    resetPassword,
    getUser,
    updatePassword,
    getPhoneNumber,
};
