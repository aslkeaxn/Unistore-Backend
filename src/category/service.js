const CategoryRepository = require("./repository");

async function getCategories() {
    const categories = await CategoryRepository.get();

    if (!categories) {
        return [];
    }

    return categories;
}

async function getCategory(categoryId) {
    return await CategoryRepository.getById(categoryId);
}

module.exports = { getCategories, getCategory };
