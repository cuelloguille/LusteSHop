const categoriaModel = require("../models/categoriaModel");

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.obtenerCategorias();

        res.json(categorias);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        const categoria = await categoriaModel.crearCategoria(
            String(nombre).trim(),
            descripcion || ""
        );

        res.status(201).json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });
    }
};

const editarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        const categoria = await categoriaModel.editarCategoria(
            id,
            String(nombre).trim(),
            descripcion || ""
        );

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al editar la categoría"
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await categoriaModel.eliminarCategoria(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json({
            mensaje: "Categoría eliminada correctamente",
            categoria
        });
    } catch (error) {
        console.error(error);

        if (error?.code === "23503") {
            return res.status(409).json({
                mensaje: "No se puede eliminar la categoría porque tiene productos asociados"
            });
        }

        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
};