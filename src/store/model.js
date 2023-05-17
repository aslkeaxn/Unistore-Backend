const { StoreType } = require("../utils/enums");
const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    image: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
        enum: Object.keys(StoreType),
        default: StoreType.User,
    },
});

module.exports = mongoose.models.Store || mongoose.model("Store", storeSchema);
