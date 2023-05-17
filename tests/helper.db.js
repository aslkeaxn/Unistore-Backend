const mongoose = require("mongoose");

module.exports = { emptyDatabase };

async function emptyDatabase() {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
}
