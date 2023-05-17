const { extractToken } = require("../utils/middleware");
const CategoryHandler = require("./handlers");
const express = require("express");

const router = express.Router();

router.get("/", extractToken, CategoryHandler.getCategories);

router.get("/:categoryId", extractToken, CategoryHandler.getCategory);

module.exports = router;
