const UserRepository = require("../user/repository");
const { raiseError } = require("../utils/helper");
const { Errors } = require("../utils/enums");
const bcrypt = require("bcrypt");
const JWT = require("../utils/jwt");

async function signInUser(email, password) {
    const user = await UserRepository.readByEmail(email);

    if (!user) {
        raiseError(
            401,
            "User email does not exist",
            Errors.InvalidLogInCredentialsError
        );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        raiseError(
            401,
            "User provided incorrect password",
            Errors.InvalidLogInCredentialsError
        );
    }

    if (!user.verified) {
        raiseError(401, "User is not verified", Errors.UserUnverifiedError);
    }

    const token = JWT.sign({ userId: user._id });

    return token;
}

async function readUserDetails(userId) {
    const backendUser = await findUserByID(userId);

    const { username, firstName, lastName, email, type, phoneNumber } =
        backendUser;

    return { userId, username, firstName, lastName, email, type, phoneNumber };
}

async function findUserByID(userId) {
    const backendUser = await UserRepository.readById(userId);

    if (!backendUser) {
        raiseError(404, "Could not find user by id", Errors.UserNotFoundError);
    }

    return backendUser;
}

module.exports = { signInUser, readUserDetails, findUserByID };
