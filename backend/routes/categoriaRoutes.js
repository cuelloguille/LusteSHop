const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaController");
const {
    verificarToken,
    verificarAdmin
} = require("../middleware/authMiddleware");

router.get("/", categoriaController.obtenerCategorias);
router.post("/", verificarToken, verificarAdmin, categoriaController.crearCategoria);
router.put("/:id", verificarToken, verificarAdmin, categoriaController.editarCategoria);
router.delete("/:id", verificarToken, verificarAdmin, categoriaController.eliminarCategoria);

module.exports = router;