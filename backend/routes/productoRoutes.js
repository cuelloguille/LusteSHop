const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");
const upload = require("../middleware/uploadMiddleware");
const {
    verificarToken,
    verificarAdmin
} = require("../middleware/authMiddleware");

router.get("/", productoController.obtenerProductos);

router.post(
    "/",
    verificarToken,
    verificarAdmin,
    upload.single("imagen"),
    productoController.crearProducto
);
router.put(
    "/:id",
    verificarToken,
    verificarAdmin,
    upload.single("imagen"),
    productoController.editarProducto
);
router.delete("/:id", verificarToken, verificarAdmin, productoController.eliminarProducto);

module.exports = router;