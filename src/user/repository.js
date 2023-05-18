const { Errors, UpdatePasswordType } = require("../utils/enums");
const Helper = require("../utils/helper");
const User = require("./model");

async function create(user) {
    try {
        return await User.create(user);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByEmail(email) {
    try {
        const query = { email: { $regex: new RegExp('^' + email + '$', 'i') } };
        return await User.findOne(query);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByUsername(username) {
    try {
        return await User.findOne({ username });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByPhoneNumber(phoneNumber) {
    try {
        return await User.findOne({ phoneNumber });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readById(userId) {
    try {
        return await User.findById(userId);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function getUser(userId) {
    try {
        return await readById(userId);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function updateUserVerification(email) {
    try {
        const user = await readByEmail(email);
        return await User.findOneAndUpdate(
            { email: user.email },
            { verified: true }
        );
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function updateUserInfo(userId, user) {
    try {
        await User.findByIdAndUpdate(userId, {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        Helper.raiseCustomError(500, error, Error.ServerError);
    }
}

async function updatePassword(data, password, type) {
    try {
        if (type === UpdatePasswordType.Id) {
            await User.findOneAndUpdate({ _id: data }, { password: password });
        } else {
            await User.findOneAndUpdate(
                { email: data },
                { password: password }
            );
        }
    } catch (error) {
        Helper.raiseCustomError(500, error, Error.ServerError);
    }
}

async function readUsername(userId) {
    return (await User.findById(userId)).username;
}

async function readIdsByUserType(userType) {
    const userIds = (await User.find({ type: userType })).map(
        (user) => user._id
    );
    return userIds;
}

const UserRepository = {
    create,
    readByEmail,
    readByUsername,
    readByPhoneNumber,
    readById,
    updateUserVerification,
    updateUserInfo,
    getUser,
    updatePassword,
    readUsername,
    readIdsByUserType,
};

module.exports = UserRepository;
