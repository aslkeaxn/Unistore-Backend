const AdvertisementRepository = require("./repository");
const { Errors, AdvertisementType, StoreId } = require("../utils/enums");
const Helper = require("../utils/helper");
const Cloudinary = require("../utils/cloudinary");
const CategoryRepository = require("../category/repository");
const UserRepository = require("../user/repository");
const StoreRepository = require("../store/repository");

async function createAdvertisement(advertisement) {
    await validateAdvertisement(advertisement);

    const { images, type, storeId, userId } = advertisement;

    const user = await UserRepository.readById(userId);

    if (storeId === "null") {
        advertisement.storeId = StoreId[type];
    } else {
        // check that user owns store
        const userStore = await StoreRepository.readStoreById(storeId);
        if (!userStore) {
            Helper.raiseError(
                404,
                "Store not found",
                Errors.StoreNotFoundError
            );
        }
    }

    if (user.type === "Partner") {
        const advertisements = await AdvertisementRepository.readAllByUserId(
            userId
        );
        const advertisementsCount = advertisements.length;
        if (user.subscriptionType === "Free" && advertisementsCount == 3) {
            Helper.raiseError(
                403,
                "Partner on free subscription",
                Errors.PartnerFreeTierError
            );
        }
    }

    const imageData = await Cloudinary.upload(images, "advertisements");
    advertisement.images = imageData;

    if (type !== AdvertisementType.Product) {
        delete advertisement.categoryId;
        delete advertisement.price;
        delete advertisement.stock;
    }

    return AdvertisementRepository.create(advertisement);
}

async function getAdvertisement(advertisementId) {
    const advertisement = await AdvertisementRepository.readByAdvertisementId(
        advertisementId
    );

    if (!advertisement) {
        Helper.raiseError(
            404,
            "Could not find advertisement by id",
            Errors.AdvertisementNotFoundError
        );
    }

    return advertisement;
}

async function getUserAdvertisements(userId, type) {
    const advertisements = await AdvertisementRepository.readByUserIdAndType(
        userId,
        type
    );

    if (!advertisements) {
        Helper.raiseError(
            404,
            "Could not find advertisement by id",
            Errors.AdvertisementNotFoundError
        );
    }

    return advertisements;
}

async function getStoreAdvertisements(storeId, limit) {
    const advertisements = await AdvertisementRepository.readByStoreId(
        storeId,
        limit
    );

    if (!advertisements) {
        return;
    }

    return advertisements;
}

async function deleteAdvertisement(userId, advertisementId) {
    const advertisement = await AdvertisementRepository.readByAdvertisementId(
        advertisementId
    );

    if (!advertisement) {
        Helper.raiseError(
            404,
            "Could not find advertisement by id",
            Errors.AdvertisementNotFoundError
        );
    }

    if (userId !== advertisement.userId.toString()) {
        Helper.raiseError(
            401,
            "Unauthorized advertisement deletion attempt",
            Errors.AdvertisementUnauthorizedError
        );
    }

    const deletedAdvertisement = await AdvertisementRepository.deleteById(
        advertisementId
    );

    if (!deletedAdvertisement) {
        Helper.raiseError(
            500,
            "Unable to delete advertisement",
            Errors.ServerError
        );
    }

    const images = advertisement.images;
    Cloudinary.destroy(images);
}

async function updateAdvertisement(userId, advertisementId, advertisement) {
    const backendAdvertisement =
        await AdvertisementRepository.readByAdvertisementId(advertisementId);

    if (!backendAdvertisement) {
        Helper.raiseError(
            404,
            "Could not find advertisement by id",
            Errors.AdvertisementNotFoundError
        );
    }

    if (userId !== backendAdvertisement.userId.toString()) {
        Helper.raiseError(
            401,
            "Unauthorized advertisement modification attempt",
            Errors.AdvertisementUnauthorizedError
        );
    }

    await AdvertisementService.validateAdvertisement(advertisement);

    const { storeId, type } = backendAdvertisement;

    if (!StoreId[storeId]) {
        // check that user owns store
    }

    if (type !== AdvertisementType.Product) {
        delete advertisement.categoryId;
        delete advertisement.price;
        delete advertisement.stock;
    }

    let imagesToDelete;

    if (advertisement.imagesToDelete) {
        imagesToDelete = JSON.parse(advertisement.imagesToDelete);
    }

    if (imagesToDelete) {
        Cloudinary.destroy(imagesToDelete);

        for (const image of imagesToDelete) {
            backendAdvertisement.images = backendAdvertisement.images.filter(
                (bImage) => bImage.public_id !== image.public_id
            );
        }
    }

    const { images } = advertisement;

    if (images) {
        const imageData = await Cloudinary.upload(images, "advertisements");

        for (const data of imageData) {
            backendAdvertisement.images.push(data);
        }
    }

    advertisement.images = backendAdvertisement.images;

    await AdvertisementRepository.updateById(advertisementId, advertisement);
}

async function readRecentByUserType(type, userType) {
    const latest = 10;
    const userIds = await UserRepository.readIdsByUserType(userType);
    const advertisements = await AdvertisementRepository.readLatestByUserIds(
        type,
        latest,
        userIds
    );
    return advertisements;
}

async function validateAdvertisement(advertisement) {
    const { type, categoryId, title, description, price, stock } =
        advertisement;

    validateType(type);
    validateTitle(title);
    validateDescription(description);

    if (type !== AdvertisementType.Product) {
        return;
    }

    await validateCategoryId(categoryId);
    validatePrice(price);
    validateStock(stock);
}

function validateType(type) {
    if (!AdvertisementType[type]) {
        Helper.raiseError(
            400,
            "Advertisement type not specified",
            Errors.AdvertisementTypeError
        );
    }
}

async function validateCategoryId(categoryId) {
    if (!categoryId) {
        Helper.raiseError(400, "Invalid category type", Errors.CategoryIdError);
    }

    const category = await CategoryRepository.getById(categoryId);

    if (!category) {
        Helper.raiseError(400, "Invalid category type", Errors.CategoryIdError);
    }
}

function validateTitle(title) {
    if (!title || title.length < 3) {
        Helper.raiseError(400, "Invalid title", Errors.AdvertisementTitleError);
    }
}

function validateDescription(description) {
    if (!description || description.length < 20) {
        Helper.raiseError(
            400,
            "Invalid description",
            Errors.AdvertisementDescriptionError
        );
    }
}

function validatePrice(price) {
    if (!price || isNaN(price)) {
        Helper.raiseError(400, "Invalid price", Errors.AdvertisementPriceError);
    }
}

function validateStock(stock) {
    if (!stock || isNaN(stock)) {
        Helper.raiseError(400, "Invalid stock", Errors.AdvertisementStockError);
    }
}

const AdvertisementService = {
    createAdvertisement,
    getAdvertisement,
    getUserAdvertisements,
    getStoreAdvertisements,
    deleteAdvertisement,
    updateAdvertisement,
    readRecentByUserType,
    validateAdvertisement,
};

module.exports = AdvertisementService;
