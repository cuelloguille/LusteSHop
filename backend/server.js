require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const productoRoutes = require("./routes/productoRoutes");
const authRoutes = require("./routes/authRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend funcionando correctamente"
    });
});

app.use("/api/productos", productoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});