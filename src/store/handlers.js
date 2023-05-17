const { cloudinary } = require("../utils/cloudinary");
const StoreService = require("./service");

async function getStores(req, res, next) {
    try {
        const { type } = req.query;
        const stores = await StoreService.getStores(type);
        res.status(200).json({ stores });
    } catch (error) {
        next(error);
    }
}

async function getStore(req, res, next) {
    try {
        const { storeId } = req.params;
        const store = await StoreService.getOneStore(storeId);
        res.status(200).json({ store });
    } catch (error) {
        next(error);
    }
}

async function getOwnStore(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const store = await StoreService.getOwnStore(userId);
        res.json({ store });
    } catch (error) {
        next(error);
    }
}

async function createStore(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { name, description } = req.body;

        const image = req.file;

        const store = { userId, name, description, image };

        const newStore = await StoreService.createStore(store);

        res.status(200).json({
            message: "Store successfully created",
            store: newStore,
        });
    } catch (error) {
        next(error);
    }
}

async function updateStore(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { storeId } = req.params;

        const { name, description } = req.body;

        const image = req.file;

        const store = { userId, name, description, image };

        await StoreService.updateStore(userId, storeId, store);
        res.status(200).json({ message: "successfully updated store" });
    } catch (error) {
        next(error);
    }
}

async function deleteStore(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { storeId } = req.params;

        await StoreService.deleteStore(userId, storeId);
        res.status(200).json({ message: "store deleted" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStores,
    getStore,
    getOwnStore,
    createStore,
    updateStore,
    deleteStore,
};
