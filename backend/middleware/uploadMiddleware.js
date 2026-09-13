const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
        return;
    }

    cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"), false);
};

const storageLocal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname || ".jpg");
        const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombre);
    }
});

const localUpload = multer({
    storage: storageLocal,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const cloudinaryUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const usarCloudinary = () => {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== "tu_cloud_name" &&
        process.env.CLOUDINARY_API_KEY !== "tu_api_key" &&
        process.env.CLOUDINARY_API_SECRET !== "tu_api_secret"
    );
};

const subirACLOUDINARY = (archivo) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: process.env.CLOUDINARY_FOLDER || "lusteshop",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(archivo.buffer);
    });
};

const upload = {
    single: (fieldName) => (req, res, next) => {
        const uploader = usarCloudinary() ? cloudinaryUpload : localUpload;

        uploader.single(fieldName)(req, res, async (error) => {
            if (error) {
                return next(error);
            }

            if (usarCloudinary() && req.file && req.file.buffer) {
                try {
                    const resultado = await subirACLOUDINARY(req.file);
                    req.file.path = resultado.secure_url;
                    req.file.url = resultado.secure_url;
                    req.file.filename = resultado.public_id;
                } catch (uploadError) {
                    return next(uploadError);
                }
            }

            next();
        });
    }
};

module.exports = upload;
