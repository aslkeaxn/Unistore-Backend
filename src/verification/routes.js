const express = require("express");
const { extractToken } = require("../utils/middleware");
const VerificationHandlers = require("./handlers");

const router = express.Router();

router.post(
    "/registration-verification",
    VerificationHandlers.createRegistrationVerification
);

router.post(
    "/password-reset-verification",
    VerificationHandlers.createPasswordResetVerification
);

router.post(
    "/password-reset-verification-confirm",
    VerificationHandlers.verifyPasswordResetVerification
);

module.exports = router;
