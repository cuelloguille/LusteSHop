const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const productoModel = require("../models/productoModel");

const eliminarArchivoImagen = async (imagenUrl) => {
    if (!imagenUrl) {
        return;
    }

    if (imagenUrl.includes("res.cloudinary.com")) {
        const publicId = imagenUrl
            .split("/upload/")[1]
            .replace(/^v\d+\//, "")
            .replace(/\.[^/.]+$/, "");

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }

        return;
    }

    const rutaRelativa = imagenUrl
        .replace(/^https?:\/\/[^/]+/, "")
        .replace(/^\//, "");

    if (!rutaRelativa.startsWith("uploads/")) {
        return;
    }

    const rutaArchivo = path.join(__dirname, "..", rutaRelativa);

    if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
    }
};

const obtenerImagenUrl = async (req, productoActual = null) => {
    if (req.file) {
        if (productoActual?.imagen_url) {
            await eliminarArchivoImagen(productoActual.imagen_url);
        }

        if (req.file.path && req.file.path.includes("/uploads/")) {
            const relativePath = req.file.path.split("/uploads/").pop();
            return `/uploads/${relativePath}`;
        }

        return req.file.path || req.file.url || `http://localhost:3000/uploads/${req.file.filename}`;
    }

    if (req.body.imagen_url === "") {
        if (productoActual?.imagen_url) {
            await eliminarArchivoImagen(productoActual.imagen_url);
        }

        return "";
    }

    if (req.body.imagen_url) {
        return req.body.imagen_url;
    }

    return productoActual?.imagen_url || "";
};

// GET /api/productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await productoModel.obtenerProductos();

        res.json(productos);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
};

// POST /api/productos
const crearProducto = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id
        } = req.body;

        if (!nombre || precio === undefined || stock === undefined) {
            return res.status(400).json({
                mensaje: "Nombre, precio y stock son obligatorios"
            });
        }

        const imagenUrl = await obtenerImagenUrl(req);

        const producto = await productoModel.crearProducto(
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
            imagenUrl
        );

        res.status(201).json(producto);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
};

// PUT /api/productos/:id
const editarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id
        } = req.body;

        const productoActual = await productoModel.obtenerProductoPorId(id);

        if (!productoActual) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        const imagenUrl = await obtenerImagenUrl(req, productoActual);

        const producto = await productoModel.editarProducto(
            id,
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
            imagenUrl
        );

        res.json(producto);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al editar el producto"
        });
    }
};

// DELETE /api/productos/:id
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const productoActual = await productoModel.obtenerProductoPorId(id);

        if (!productoActual) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        if (productoActual.imagen_url) {
            await eliminarArchivoImagen(productoActual.imagen_url);
        }

        const producto = await productoModel.eliminarProducto(id);

        res.json({
            mensaje: "Producto eliminado correctamente",
            producto
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto,
    editarProducto,
    eliminarProducto
};