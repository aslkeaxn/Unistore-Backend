const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./cloudinary");
const multer = require("multer");
const { v4 } = require("uuid");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "temp",
        public_id: function (req, file) {
            const mimetypeArray = file.mimetype.split("/");
            const mimetype = mimetypeArray[0];

            if (mimetype !== "image") {
                throw new Error("You can only upload images");
            }

            const identifier = v4();
            const name = `${identifier}`;

            return name;
        },
    },
});

const upload = multer({ storage: storage });

module.exports = { upload };
