const { extractToken } = require("../utils/middleware");
const { upload } = require("../utils/multer");
const express = require("express");

const StoreHandler = require("./handlers");

const router = express.Router();

router.post(
    "/",
    extractToken,
    upload.single("image"),
    StoreHandler.createStore
);

router.get("/", extractToken, StoreHandler.getStores);

router.get("/me", extractToken, StoreHandler.getOwnStore);

router.get("/:storeId", extractToken, StoreHandler.getStore);

router.put(
    "/:storeId",
    extractToken,
    upload.single("image"),
    StoreHandler.updateStore
);

router.delete("/:storeId", extractToken, StoreHandler.deleteStore);

module.exports = router;
