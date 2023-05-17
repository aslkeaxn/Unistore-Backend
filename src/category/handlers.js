const CategoryService = require("./service");

async function getCategories(req, res, next) {
    try {
        const categories = await CategoryService.getCategories();

        res.status(200).json({ categories });
    } catch (error) {
        next(error);
    }
}

async function getCategory(req, res, next) {
    try {
        const { categoryId } = req.params;
        const category = await CategoryService.getCategory(categoryId);
        res.json({ category });
    } catch (error) {
        next(error);
    }
}

module.exports = { getCategories, getCategory };
