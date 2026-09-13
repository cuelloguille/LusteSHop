const pool = require("../config/database");

// Buscar usuario por email
const buscarUsuarioPorEmail = async (email) => {
    const resultado = await pool.query(
        `SELECT * FROM usuarios
         WHERE email = $1`,
        [email]
    );

    return resultado.rows[0];
};

// Crear usuario
const crearUsuario = async (
    nombre,
    apellido,
    email,
    password,
    telefono,
    direccion,
    ciudad,
    codigo_postal
) => {
    const resultado = await pool.query(
        `INSERT INTO usuarios
        (
            nombre,
            apellido,
            email,
            password,
            telefono,
            direccion,
            ciudad,
            codigo_postal
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
            id,
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            ciudad,
            codigo_postal,
            rol,
            fecha_creacion`,
        [
            nombre,
            apellido,
            email,
            password,
            telefono,
            direccion,
            ciudad,
            codigo_postal
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    buscarUsuarioPorEmail,
    crearUsuario
};