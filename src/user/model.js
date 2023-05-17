const { UserType, SubscriptionType } = require("../utils/enums");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: Object.keys(UserType) },
    verified: { type: Boolean, required: true, default: false },
    subscriptionType: {
        type: String,
        enum: Object.keys(SubscriptionType),
        default: SubscriptionType.Free,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expireAfterSeconds: 300,
            partialFilterExpression: { verified: false },
        },
    },
});

module.exports = mongoose.model("User", UserSchema);
