const AdvertisementService = require("./service");
const Cloudinary = require("../utils/cloudinary");
const { UserType, AdvertisementType, Errors } = require("../utils/enums");
const UserService = require("../user/service");

async function createAdvertisement(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { storeId, categoryId, title, description, type, price, stock } =
            req.body;

        const images = req.files;

        const advertisement = {
            userId,
            storeId,
            categoryId,
            title,
            description,
            type,
            price,
            stock,
            images,
        };

        await AdvertisementService.createAdvertisement(advertisement);

        res.status(201).json({
            message: "An advertisement has been created",
        });
    } catch (error) {
        next(error);
    }
}

async function getAdvertisement(req, res, next) {
    try {
        const { advertisementId } = req.params;
        const advertisement = await AdvertisementService.getAdvertisement(
            advertisementId
        );

        res.status(201).json({ advertisement });
    } catch (error) {
        next(error);
    }
}

async function getUserAdvertisements(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { type } = req.query;
        const advertisement = await AdvertisementService.getUserAdvertisements(
            userId,
            type
        );

        res.status(201).json({ advertisement });
    } catch (error) {
        next(error);
    }
}

async function getStoreAdvertisements(req, res, next) {
    try {
        const { storeId } = req.params;
        const { limit } = req.query;
        const advertisements =
            await AdvertisementService.getStoreAdvertisements(storeId, limit);
        res.status(200).json({ advertisements });
    } catch (error) {
        next(error);
    }
}

async function deleteAdvertisement(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { advertisementId } = req.params;
        await AdvertisementService.deleteAdvertisement(userId, advertisementId);

        res.status(201).json({ message: "Advertisement has been deleted" });
    } catch (error) {
        next(error);
    }
}

async function updateAdvertisement(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { advertisementId } = req.params;
        const {
            categoryId,
            title,
            description,
            type,
            price,
            stock,
            imagesToDelete,
        } = req.body;

        const images = req.files;

        const advertisement = {
            userId,
            categoryId,
            title,
            description,
            type,
            price,
            stock,
            images,
            imagesToDelete,
        };

        await AdvertisementService.updateAdvertisement(
            userId,
            advertisementId,
            advertisement
        );

        res.status(201).json({ message: "Advertisement successfully updated" });
    } catch (error) {
        next(error);
    }
}

async function readRecentByUserType(req, res, next) {
    try {
        const { userId } = req.decodedToken;
        const { type, userType } = req.query;

        if (!AdvertisementType[type] || !UserType[userType]) {
            return res.status(400).json({
                error: "You need to provide valid advertisement and user types",
            });
        }

        const user = await UserService.getUser(userId);

        if (user.type !== UserType.Student) {
            return res
                .status(401)
                .json({ error: Errors.UnauthorizedActionError });
        }

        const advertisements = await AdvertisementService.readRecentByUserType(
            type,
            userType
        );

        res.json({ advertisements });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAdvertisement,
    getAdvertisement,
    getUserAdvertisements,
    getStoreAdvertisements,
    deleteAdvertisement,
    updateAdvertisement,
    readRecentByUserType,
};
