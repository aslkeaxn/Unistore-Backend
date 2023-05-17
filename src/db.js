const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

function connect() {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            logger.info("Connected to DB");
        })
        .catch((error) => logger.error(error));
}

async function connectJest() {
    await mongoose.connect(`${MONGODB_URI}`);
}

async function disconnect() {
    await mongoose.connection.close();
}

module.exports = { connect, connectJest, disconnect };
