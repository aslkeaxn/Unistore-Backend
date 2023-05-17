const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PUBLIC = path.join(__dirname, "..", "..", "public");

const PORT = process.env.PORT;

const MONGODB_URI =
    process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI
        : process.env.NODE_ENV === "development"
        ? process.env.TEST_MONGODB_URI
        : process.env.JEST_MONGODB_URI;

const NODEMAILER = {
    SERVICE: process.env.SERVICE,
    HOST: process.env.NODEMAILER_HOST,
    EMAIL: process.env.NODEMAILER_EMAIL,
    PASSWORD: process.env.NODEMAILER_PASSWORD,
};

const JWT_SECRET = process.env.JWT_SECRET;

const URL =
    process.env.NODE_ENV in { test: 1, development: 1 }
        ? "http://localhost:5000"
        : process.env.RENDER_EXTERNAL_URL;

module.exports = {
    PORT,
    MONGODB_URI,
    NODEMAILER,
    JWT_SECRET,
    PUBLIC,
    URL,
};
