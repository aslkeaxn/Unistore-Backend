const { Errors } = require("../utils/enums");
const Helper = require("../utils/helper");
const Category = require("./model");

async function get() {
    try {
        return await Category.find({});
    } catch (error) {
        Helper.raiseCustomError(500, error, Errors.ServerError);
    }
}

async function getById(categoryId) {
    try {
        return await Category.findById(categoryId);
    } catch (error) {
        console.error(error);
    }
}

const CategoryRepository = { get, getById };

module.exports = CategoryRepository;
