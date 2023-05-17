const { cloudinary } = require("../utils/cloudinary");
const StoreRepository = require("./repository");
const { Errors, UserType, StoreType } = require("../utils/enums");
const Helper = require("../utils/helper");
const Cloudinary = require("../utils/cloudinary");
const UserRepository = require("../user/repository");

async function getStores(type) {
    let stores;

    if (type && type.toUpperCase() === "USER") {
        stores = await StoreRepository.readAllStores("User");
    } else if (type && type.toUpperCase() === "PARTNER") {
        stores = await StoreRepository.readAllStores("Partner");
    } else {
        stores = await StoreRepository.readAllStores();
    }

    return stores;
}

async function getOneStore(storeId) {
    const store = await StoreRepository.readStoreById(storeId);

    if (!store) {
        return Helper.raiseError(
            404,
            "Store Not Found",
            Errors.StoreNotFoundError
        );
    }

    return store;
}

async function getOwnStore(userId) {
    const store = await StoreRepository.readStoreByUserId(userId);
    return store;
}

async function createStore(store) {
    const { userId, name, image } = store;

    const storeExists = await StoreRepository.readStoreByUserId(userId);
    const storeNameExists = await StoreRepository.readStoreByName(name);

    if (storeExists) {
        Helper.raiseError(
            409,
            "User already created a small business",
            Errors.UserStoreAlreadyExistsError
        );
    }

    if (storeNameExists) {
        Helper.raiseError(
            409,
            "Small business name already in use",
            Errors.StoreNameAlreadyInUseError
        );
    }

    StoreService.validateStore(store);

    const { type } = await UserRepository.readById(userId);

    store.type = type === UserType.Student ? StoreType.User : StoreType.Partner;
    store.image = await Cloudinary.upload(image, "store_images");

    return await StoreRepository.create(store);
}

async function updateStore(userId, storeId, store) {
    const { image } = store;

    const dbStore = await StoreRepository.readStoreById(storeId);

    if (!dbStore) {
        Helper.raiseError(
            404,
            "Store does not exist",
            Errors.StoreNotFoundError
        );
    }

    if (userId !== dbStore.userId.toString()) {
        Helper.raiseError(
            401,
            "User not authorized to modify store",
            Errors.UnauthorizedActionError
        );
    }

    validateStore(store);

    store.image = await Cloudinary.upload(image, "store_images");

    await StoreRepository.update(storeId, store);

    if (image) {
        Cloudinary.destroy(dbStore.image);
    }
}

async function deleteStore(userId, storeId) {
    const dbStore = await StoreRepository.readStoreById(storeId);

    if (!dbStore) {
        Helper.raiseError(404, "Store not found", Errors.StoreNotFoundError);
    }

    if (dbStore.userId.toString() !== userId) {
        Helper.raiseError(
            401,
            "User not authorized to delete store",
            Errors.UnauthorizedActionError
        );
    }

    await StoreRepository.removeStore(storeId);

    Cloudinary.destroy(dbStore.image);
}

function validateStore(store) {
    const { name, description, image } = store;
    validateName(name);
    validateDescription(description);
    validateImage(image, store.image);
}

function validateName(name) {
    if (!name || name.length < 4) {
        Helper.raiseError(
            400,
            "Invalid small business name by user",
            Errors.StoreNameInvalidError
        );
    }
}

function validateDescription(description) {
    if (!description || description.length < 20) {
        Helper.raiseError(
            400,
            "Invalid description by user",
            Errors.StoreDescriptionInvalidError
        );
    }
}

function validateImage(image, storeImage) {
    if (!image) {
        if (!storeImage) {
            Helper.raiseError(
                400,
                "User missing image file",
                Errors.StoreImageMissingError
            );
        }
    }
}

const StoreService = {
    validateStore,
    getStores,
    getOneStore,
    getOwnStore,
    createStore,
    updateStore,
    deleteStore,
};

module.exports = StoreService;
