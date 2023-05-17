const Advertisement = require("./model");
const Helper = require("../utils/helper");
const { Errors, AdvertisementType } = require("../utils/enums");
const UserRepository = require("../user/repository");

async function create(advertisement) {
    try {
        return await Advertisement.create(advertisement);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByAdvertisementId(advertisementId) {
    try {
        return await Advertisement.findById(advertisementId);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByUserIdAndType(userId, type) {
    try {
        return await Advertisement.find({ userId, type });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readByStoreId(storeId, limit = 0) {
    try {
        return await Advertisement.find({ storeId }).limit(limit);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readAllByUserId(userId) {
    try {
        return await Advertisement.find({ userId });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function deleteById(advertisementId) {
    try {
        return await Advertisement.findByIdAndDelete(advertisementId);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function updateById(advertisementId, advertisement) {
    try {
        return await Advertisement.findByIdAndUpdate(
            advertisementId,
            advertisement
        );
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readLatestByUserIds(type, latest, userIds) {
    const advertisements = await Advertisement.find({
        userId: { $in: userIds },
        type,
    })
        .sort({ date: -1 })
        .limit(latest);
    return advertisements;
}

module.exports = {
    create,
    readByAdvertisementId,
    readByUserIdAndType,
    deleteById,
    updateById,
    readByStoreId,
    readAllByUserId,
    readLatestByUserIds,
};
