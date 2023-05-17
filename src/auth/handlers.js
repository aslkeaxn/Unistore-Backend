const { Errors } = require("../utils/enums");
const { raiseError } = require("../utils/helper");
const AuthService = require("./service");

async function signInUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const userToken = await AuthService.signInUser(email, password);

        res.status(200).json({ userToken });
    } catch (error) {
        next(error);
    }
}

async function readUserDetails(req, res, next) {
    try {
        const { userId } = req.decodedToken;

        if (!userId) {
            raiseError(400, "No userId field in token", Errors.JWTError);
        }

        const user = await AuthService.readUserDetails(userId);

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signInUser,
    readUserDetails,
};
