const VerificationRepository = require("./repository");
const UserRepository = require("../user/repository");
const UserService = require("../user/service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("../utils/jwt");
const { VerificationType, Errors } = require("../utils/enums");
const { raiseError } = require("../utils/helper");

async function validateEmailVerification(email, registrationVerificationCode) {
    const user = await UserRepository.readByEmail(email);

    if (user.verified) {
        raiseError(409, "User already verified", Errors.UserVerfiedError);
    }

    const verification = await VerificationRepository.getVerificationByUserId(
        user._id
    );

    if (!verification) {
        raiseError(
            404,
            "Verification code expired",
            Errors.ExpiredVerificationCodeError
        );
    }

    const validCode = await bcrypt.compare(
        registrationVerificationCode,
        verification.verificationCode
    );

    if (!validCode) {
        raiseError(
            401,
            "User entered incorrect verification code",
            Errors.InvalidVerificationCodeError
        );
    }
}

async function createVerificationCode(userId, verificationType) {
    const verificationCode = crypto.randomBytes(3).toString("hex");

    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(verificationCode, saltRounds);

    const verification = {
        userId,
        verificationCode: hashedCode,
        type: verificationType,
    };

    await VerificationRepository.create(verification);

    return verificationCode;
}

async function createPasswordResetVerification(email) {
    // get the user (check email)
    // if no user, raise error
    // extract userId
    // check if there is a previous verification with the same id
    // if there is, raise error
    // create the code
    // hash the code
    // create the verification with hashed code
    // return the original code
    const user = await UserRepository.readByEmail(email);
    if (!user) {
        raiseError(404, "Email does not exist", Errors.UserNotFoundError);
    }

    const userId = user._id;
    const verification = await VerificationRepository.getVerificationByUserId(
        userId
    );

    if (verification && verification.type === VerificationType.PasswordReset) {
        raiseError(
            404,
            "Verification code already sent",
            Errors.VerificationCodeError
        );
    }

    const verificationCode = await VerificationService.createVerificationCode(
        userId,
        VerificationType.PasswordReset
    );
    return verificationCode;
}

async function validatePasswordResetCode(passwordResetCode, email) {
    // get the user
    // extract user id
    // get verification using userId
    // check that the codes match
    // if not raise error
    // create token with email
    // return token
    const user = await UserRepository.readByEmail(email);
    const userId = user._id;

    const verification = await VerificationRepository.getVerificationByUserId(
        userId
    );

    if (!verification) {
        raiseError(
            404,
            "Verification code expired",
            Errors.ExpiredPasswordResetCodeError
        );
    }

    const valid = await bcrypt.compare(
        passwordResetCode,
        verification.verificationCode
    );

    if (!valid) {
        raiseError(
            401,
            "User entered incorrect verification code",
            Errors.InvalidVerificationCodeError
        );
    }

    await VerificationRepository.deleteById(verification._id);
    const passwordResetToken = jwt.sign({ email: email });
    return passwordResetToken;
}

const VerificationService = {
    createVerificationCode,
    createPasswordResetVerification,
    validatePasswordResetCode,
    validateEmailVerification,
};

module.exports = VerificationService;
