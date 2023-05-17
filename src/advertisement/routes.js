const AdvertisementHandlers = require("./handlers");
const express = require("express");
const { extractToken } = require("../utils/middleware");
const { upload } = require("../utils/multer");

const router = express.Router();

router.get("/recent", extractToken, AdvertisementHandlers.readRecentByUserType);

router.post(
    "/",
    extractToken,
    upload.array("images"),
    AdvertisementHandlers.createAdvertisement
);

router.get(
    "/:advertisementId",
    extractToken,
    AdvertisementHandlers.getAdvertisement
);

router.get("/", extractToken, AdvertisementHandlers.getUserAdvertisements);

router.get(
    "/store/:storeId",
    extractToken,
    AdvertisementHandlers.getStoreAdvertisements
);

router.delete(
    "/:advertisementId",
    extractToken,
    AdvertisementHandlers.deleteAdvertisement
);

router.put(
    "/:advertisementId",
    extractToken,
    upload.array("images"),
    AdvertisementHandlers.updateAdvertisement
);

module.exports = router;
