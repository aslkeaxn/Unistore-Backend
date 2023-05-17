const VerificationService = require("./service");
const UserService = require("../user/service");
const Mailer = require("../utils/mailer");

async function createRegistrationVerification(req, res, next) {
    try {
        const { registrationVerificationCode, email } = req.body;
        await VerificationService.validateEmailVerification(
            email,
            registrationVerificationCode
        );
        await UserService.verifyUser(email);

        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}

async function createPasswordResetVerification(req, res, next) {
    try {
        const { email } = req.body;

        const verificationCode =
            await VerificationService.createPasswordResetVerification(email);

        await Mailer.sendPasswordVerificationEmail(email, verificationCode);

        res.status(200).json({
            message: "A verification code has been sent to your email.",
        });
    } catch (error) {
        next(error);
    }
}

async function verifyPasswordResetVerification(req, res, next) {
    try {
        const { passwordResetCode, email } = req.body;

        const passwordResetToken =
            await VerificationService.validatePasswordResetCode(
                passwordResetCode,
                email
            );

        res.status(200).json({ passwordResetToken });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createRegistrationVerification,
    createPasswordResetVerification,
    verifyPasswordResetVerification,
};
