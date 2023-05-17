const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const destroyImage = (image) => {
    if (!image) {
        return;
    }
    if (image.public_id) {
        return cloudinary.uploader.destroy(image.public_id);
    }

    cloudinary.uploader.destroy(image.filename);
};

const destroy = (images) => {
    if (!images) {
        return;
    }

    if (!Array.isArray(images)) {
        return destroyImage(images);
    }

    for (const image of images) {
        destroyImage(image);
    }
};

const uploadImage = async (image, target_folder) => {
    const result = await cloudinary.uploader.upload(image.path, {
        folder: target_folder,
    });
    destroyImage(image);
    return result
};

const upload = async (images, target_folder) => {
    if (!Array.isArray(images)) {
        return uploadImage(images, target_folder);
    }

    const imageData = [];

    for (const image of images) {
        const result = await uploadImage(image, target_folder);

        imageData.push({
            public_id: result.public_id,
            url: result.secure_url,
        });

    }

    return imageData;
};

module.exports = {
    cloudinary,
    destroy,
    upload,
};
