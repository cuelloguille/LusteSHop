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

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    process.env.FRONTEND_URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    return /^(http:\/\/)(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("No permitido por CORS"));
    },
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