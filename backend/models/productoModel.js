const pool = require("../config/database");

// Obtener todos los productos
const obtenerProductos = async () => {
    const resultado = await pool.query(
        `SELECT * FROM productos
         WHERE activo = true
         ORDER BY id ASC`
    );

    return resultado.rows;
};

// Obtener un producto por ID
const obtenerProductoPorId = async (id) => {
    const resultado = await pool.query(
        `SELECT * FROM productos
         WHERE id = $1`,
        [id]
    );

    return resultado.rows[0];
};

// Crear producto
const crearProducto = async (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id,
    imagen_url = ""
) => {
    const resultado = await pool.query(
        `INSERT INTO productos
        (nombre, descripcion, precio, stock, categoria_id, imagen_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [nombre, descripcion, precio, stock, categoria_id, imagen_url]
    );

    return resultado.rows[0];
};

// Editar producto
const editarProducto = async (
    id,
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id,
    imagen_url = ""
) => {
    const resultado = await pool.query(
        `UPDATE productos
         SET nombre = $1,
             descripcion = $2,
             precio = $3,
             stock = $4,
             categoria_id = $5,
             imagen_url = $6
         WHERE id = $7
         RETURNING *`,
        [nombre, descripcion, precio, stock, categoria_id, imagen_url, id]
    );

    return resultado.rows[0];
};

// Eliminar producto
const eliminarProducto = async (id) => {
    const resultado = await pool.query(
        `UPDATE productos
         SET activo = false
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    editarProducto,
    eliminarProducto
};