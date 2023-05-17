const { Errors } = require("../utils/enums");
const Helper = require("../utils/helper");
const Verification = require("./model");

async function create(verification) {
    try {
        return await Verification.create(verification);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function getVerificationByUserId(userId) {
    try {
        return await Verification.findOne({ userId });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function deleteById(verificationId) {
    try {
        return await Verification.findOneAndDelete(verificationId);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

module.exports = { create, getVerificationByUserId, deleteById };
