const mongoose = require("mongoose");
const { AdvertisementType, StoreId } = require("../utils/enums");

const AdvertisementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Store",
        default: () => StoreId[this.type],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Category",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Number, required: true, default: () => new Date().getTime() },
    type: {
        type: String,
        required: true,
        enum: Object.keys(AdvertisementType),
    },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("Advertisement", AdvertisementSchema);
