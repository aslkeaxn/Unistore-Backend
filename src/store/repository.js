const { Errors } = require('../utils/enums');
const Helper = require("../utils/helper");
const Store = require('./model')

async function readAllStores(type = "DEFAULT") {
    try {
        return await Store.find({ type })?.populate('userId', 'username email');
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readStoreByName(name) {
    try {
        return await Store.findOne({ name });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readStoreByUserId(userId) {
    try {
        return await Store.findOne({ userId });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function readStoreById(storeId) {
    try {
        return await Store.findOne({ _id: storeId });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function create(store) {
    try {
        return await Store.create(store);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function update(storeId, store) {
    try {
        return await Store.findByIdAndUpdate(storeId, store);
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function removeStore(storeId) {
    try {
        return await Store.findOneAndDelete({ _id: storeId });
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

module.exports = {
    readAllStores,
    readStoreByName,
    readStoreByUserId,
    readStoreById,
    create,
    update,
    removeStore,
}