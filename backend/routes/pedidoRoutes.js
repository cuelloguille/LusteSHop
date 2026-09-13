const express = require("express");
const router = express.Router();

const pedidoController = require("../controllers/pedidoController");

const {
    verificarToken
} = require("../middleware/authMiddleware");

router.post(
    "/",
    pedidoController.crearPedido
);

router.get(
    "/mis-pedidos",
    verificarToken,
    pedidoController.obtenerMisPedidos
);

module.exports = router;