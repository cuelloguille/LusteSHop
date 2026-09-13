const cloudinary = require("cloudinary").v2;

const hasCloudinaryCredentials = () => {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
};

if (hasCloudinaryCredentials()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
    console.log("Cloudinary configurado correctamente");
} else {
    console.warn("Cloudinary no configurado: se usará almacenamiento local para las imágenes");
}

module.exports = cloudinary;
module.exports.hasCloudinaryCredentials = hasCloudinaryCredentials;
