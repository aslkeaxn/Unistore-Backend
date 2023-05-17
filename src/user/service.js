const AuthService = require("../auth/service");
const UserRepository = require("./repository");
const {
    Errors,
    Domains,
    UserType,
    UpdatePasswordType,
} = require("../utils/enums");
const Helper = require("../utils/helper");
const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");

// user
// -- unregistered
// -- registered
// ---- verified
// ---- not verified
// -- unique username

async function createUser(user) {
    await validateUserRegistrationDetails(user);

    const password = await hashPassword(user.password);
    user.password = password;

    const newUser = await UserRepository.create(user);

    return newUser._id;
}

async function getUser(userId) {
    const dbuser = await UserRepository.getUser(userId);

    const { firstName, lastName, phoneNumber, username, email, type } = dbuser;
    const user = { firstName, lastName, phoneNumber, username, email, type };

    return user;
}

async function getPhoneNumber(userId) {
    const user = await UserRepository.readById(userId);

    if (!user) {
        Helper.raiseError(404, "Could not find user", Errors.UserNotFoundError);
    }

    const { phoneNumber } = user;

    return phoneNumber;
}

async function updateUser(userId, user) {
    // read the user
    // validate fields to modify
    // update the user in database
    AuthService.findUserByID(userId);
    await validateUserInfo(user, userId);
    await UserRepository.updateUserInfo(userId, user);
}

async function resetPassword(email, password) {
    // get user
    // validate password
    // update password using repo
    UserService.validatePassword(password);
    const hashedPassword = await UserService.hashPassword(password);
    await UserRepository.updatePassword(
        email,
        hashedPassword,
        UpdatePasswordType.Email
    );
}

async function updatePassword(userId, password, newPassword) {
    const dbuser = await UserRepository.readById(userId);
    const valid = await bcrypt.compare(password, dbuser.password);
    if (!valid) {
        Helper.raiseError(
            401,
            "User entered incorrect password",
            Errors.IncorrectPasswordError
        );
    }

    validatePassword(newPassword);

    const newHashedPassword = await hashPassword(newPassword);
    await UserRepository.updatePassword(
        userId,
        newHashedPassword,
        UpdatePasswordType.Id
    );
}

async function verifyUser(email) {
    return await UserRepository.updateUserVerification(email);
}

async function hashPassword(password) {
    try {
        const rounds = 10;
        const hashedPassword = await bcrypt.hash(password, rounds);
        return hashedPassword;
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function validateUserInfo(user, userId) {
    validateFirstName(user.firstName);
    validateLastName(user.lastName);
    validateEmailForm(user.email);
    if (UserType[user.type] === UserType.Student) {
        validateEmailDomain(user.email);
    }

    await validatePhoneNumber(user.phoneNumber, userId);
    await validateUsername(user.username, userId);
    await validateRegisteredEmail(user.email, userId);
}

async function validateUserRegistrationDetails(user) {
    validateType(user.type);
    validateEmailForm(user.email);
    await validateUsername(user.username);
    await validatePhoneNumber(user.phoneNumber);

    if (UserType[user.type] === UserType.Student) {
        validateEmailDomain(user.email);
    }

    await validateRegisteredEmail(user.email, null);
    await validateRegisteredUsername(user.username, null);
    await validateRegisteredPhoneNumber(user.phoneNumber, null);

    validateFirstName(user.firstName);
    validateLastName(user.lastName);
    validatePassword(user.password);
}

function validateType(type) {
    if (!UserType[type]) {
        Helper.raiseError(400, "User type not specified", Errors.UserTypeError);
    }
}

async function validateRegisteredEmail(email, id) {
    const user = await UserRepository.readByEmail(email);

    if (!user) {
        return;
    }

    if (user._id.toString() === id) {
        return;
    }

    if (user.verified) {
        Helper.raiseError(
            400,
            "Attempted to use existing email",
            Errors.EmailVerifiedError
        );
    }

    Helper.raiseError(
        400,
        "Attempted to recreate unverified account",
        Errors.VerificationCodeError
    );
}

async function validateRegisteredUsername(username, userId) {
    const user = await UserRepository.readByUsername(username);

    if (!user) {
        return;
    }

    if (user._id.toString() === userId) {
        return;
    }

    if (user.username === username) {
        Helper.raiseError(
            400,
            "Attempted to use existing username",
            Errors.UsernameExistsError
        );
    }
}

async function validateRegisteredPhoneNumber(phoneNumber, userId) {
    const user = await UserRepository.readByPhoneNumber(phoneNumber);

    if (!user) {
        return;
    }

    if (user._id.toString() === userId) {
        return;
    }

    Helper.raiseError(
        400,
        "Attempted to use an existing phone number",
        Errors.PhoneNumberExistsError
    );
}

function validateFirstName(firstName) {
    const valid =
        firstName && Helper.isAlphabetic(firstName) && firstName.length > 1;

    if (!valid) {
        Helper.raiseError(400, "Invalid first name", Errors.FirstNameError);
    }
}

function validateLastName(lastName) {
    const valid =
        lastName && Helper.isAlphabetic(lastName) && lastName.length > 1;

    if (!valid) {
        Helper.raiseError(400, "Invalid last name", Errors.LastNameError);
    }
}

async function validateUsername(username, userId) {
    await validateRegisteredUsername(username, userId);

    const valid =
        username && Helper.isAlphanumeric(username) && username.length > 3;

    if (!valid) {
        Helper.raiseError(400, "Invalid username", Errors.UsernameFormError);
    }
}

function validateEmailForm(email) {
    const validForm =
        email &&
        email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );

    if (!validForm) {
        Helper.raiseError(400, "Invalid email form", Errors.EmailFormError);
    }
}

function validateEmailDomain(email) {
    const atIndex = email.indexOf("@");
    const domain = email.substring(atIndex + 1);
    const validDomain = Domains[domain];

    if (!validDomain) {
        Helper.raiseError(
            400,
            "Invalid university domain",
            Errors.EmailDomainError
        );
    }
}

function validatePassword(password) {
    const valid = password && password.length > 5;

    if (!valid) {
        Helper.raiseError(400, "Invalid password", Errors.PasswordError);
    }
}

async function validatePhoneNumber(phoneNumber, id) {
    await validateRegisteredPhoneNumber(phoneNumber, id);

    const valid =
        phoneNumber && !isNaN(phoneNumber) && phoneNumber.length === 8;

    if (!valid) {
        Helper.raiseError(
            400,
            "Invalid phone number",
            Errors.PhoneNumberFormError
        );
    }
}

const UserService = {
    createUser,
    updateUser,
    resetPassword,
    verifyUser,
    getUser,
    getPhoneNumber,
    updatePassword,
    validatePassword,
    hashPassword,
};

module.exports = UserService;
