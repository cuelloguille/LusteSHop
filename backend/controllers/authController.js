const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

const JWT_SECRET = "clave_secreta_lusteshop";

// REGISTRO
const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            telefono,
            direccion,
            ciudad,
            codigo_postal
        } = req.body;

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, apellido, email y contraseña son obligatorios"
            });
        }

        const usuarioExistente =
            await usuarioModel.buscarUsuarioPorEmail(email);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El email ya está registrado"
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const usuario = await usuarioModel.crearUsuario(
            nombre,
            apellido,
            email,
            passwordEncriptada,
            telefono,
            direccion,
            ciudad,
            codigo_postal
        );

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al registrar usuario"
        });
    }
};


// LOGIN
const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y contraseña son obligatorios"
            });
        }

        const usuario =
            await usuarioModel.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            mensaje: "Inicio de sesión correcto",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};