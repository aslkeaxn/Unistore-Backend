const { Errors } = require("./enums");
const { raiseError } = require("./helper");
const { verify } = require("./jwt");
const logger = require("./logger");
const Cloudinary = require("./cloudinary");

function errorHandler(error, req, res, next) {
    logger.error(error);
    if (req.file) {
        Cloudinary.destroy(req.file); 
    } else {
        Cloudinary.destroy(req.files);
    }

    const status = error.status || 500;
    const message = error.custom || "Server error";

    res.status(status).json({ error: message });
}

function extractToken(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.includes("Bearer") ||
            !authorizationHeader.includes(" ")
        ) {
            raiseError(401, "Invalid authorization header", Errors.JWTError);
        }

        const token = authorizationHeader.split(" ")[1];

        const decodedToken = verify(token);

        req.decodedToken = decodedToken;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { errorHandler, extractToken };
