const jwt = require("jsonwebtoken");

const JWT_SECRET = "clave_secreta_lusteshop";

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: "No se proporcionó un token"
            });
        }

        const partes = authHeader.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                mensaje: "Formato de token inválido"
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(token, JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};

const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({
            mensaje: "Acceso denegado. Se requiere rol de administrador"
        });
    }

    next();
};

module.exports = {
    verificarToken,
    verificarAdmin
};