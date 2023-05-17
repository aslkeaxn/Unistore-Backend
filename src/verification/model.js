const { VerificationType } = require("../utils/enums");
const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    verificationCode: { type: String, required: true },
    type: { type: String, required: true, enum: Object.keys(VerificationType) },
    createdAt: { type: Date, default: Date.now, expires: "300s" },
});

module.exports = mongoose.model("Verification", VerificationSchema);
