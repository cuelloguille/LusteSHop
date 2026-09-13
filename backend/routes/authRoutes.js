const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/registro", authController.registrarUsuario);
router.post("/login", authController.iniciarSesion);
router.post("/solicitar-recuperacion", authController.solicitarRecuperacion);
router.post("/reset-password", authController.resetPassword);
module.exports = router;