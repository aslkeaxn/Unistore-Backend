const UserHandlers = require("./handlers");
const express = require("express");
const { extractToken } = require("../utils/middleware");

const router = express.Router();

router.post("/", UserHandlers.createUser);

router.get("/", extractToken, UserHandlers.getUser);

router.get("/:userId/phone-number", extractToken, UserHandlers.getPhoneNumber);

router.put("/", extractToken, UserHandlers.updateUser);

router.put("/password-reset", extractToken, UserHandlers.resetPassword); //password reset with email

router.put("/update-password", extractToken, UserHandlers.updatePassword); // when user logged in

module.exports = router;
