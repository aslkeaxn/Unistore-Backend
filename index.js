const { PORT } = require("./src/utils/config");
const logger = require("./src/utils/logger");
const app = require("./src/app");
const db = require("./src/db");

app.listen(PORT, () => {
    logger.info("Server listening at port", PORT);
    db.connect();
});
