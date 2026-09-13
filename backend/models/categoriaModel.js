const pool = require("../config/database");

const obtenerCategorias = async () => {
    const resultado = await pool.query(
        `SELECT id, nombre, descripcion
         FROM categorias
         ORDER BY nombre ASC`
    );

    return resultado.rows;
};

const crearCategoria = async (nombre, descripcion = "") => {
    const resultado = await pool.query(
        `INSERT INTO categorias (nombre, descripcion)
         VALUES ($1, $2)
         RETURNING id, nombre, descripcion`,
        [nombre, descripcion]
    );

    return resultado.rows[0];
};

const editarCategoria = async (id, nombre, descripcion = "") => {
    const resultado = await pool.query(
        `UPDATE categorias
         SET nombre = $1, descripcion = $2
         WHERE id = $3
         RETURNING id, nombre, descripcion`,
        [nombre, descripcion, id]
    );

    return resultado.rows[0];
};

const eliminarCategoria = async (id) => {
    const resultado = await pool.query(
        `DELETE FROM categorias
         WHERE id = $1
         RETURNING id, nombre, descripcion`,
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
};