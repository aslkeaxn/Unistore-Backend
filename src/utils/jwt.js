const { JWT_SECRET } = require("./config");
const { Errors } = require("./enums");
const jwt = require("jsonwebtoken");
const { raiseCustomError } = require("./helper");

function sign(data, expiration) {
    return expiration
        ? jwt.sign(data, JWT_SECRET, { expiresIn: 300000 })
        : jwt.sign(data, JWT_SECRET);
}

function verify(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        raiseCustomError(401, error, Errors.JWTError);
    }
}

module.exports = { sign, verify };
