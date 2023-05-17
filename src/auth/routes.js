const AuthHandler = require("./handlers");
const express = require("express");
const { extractToken } = require("../utils/middleware");

const router = express.Router();

router.post("/signIn", AuthHandler.signInUser);

router.post("/me", extractToken, AuthHandler.readUserDetails);

module.exports = router;
