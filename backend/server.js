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

// Orígenes permitidos
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "https://lusteshop-frontend.onrender.com"
];

// Agregar FRONTEND_URL si existe
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

// Configuración CORS
app.use(
    cors({
        origin: function (origin, callback) {

            // Permitir solicitudes sin origin
            // (por ejemplo Postman o algunas herramientas)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("Origen bloqueado por CORS:", origin);

            return callback(new Error("No permitido por CORS"));
        },

        credentials: true,

        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Middleware para recibir JSON
app.use(express.json());

// Carpeta de imágenes
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend funcionando correctamente"
    });
});

// Rutas API
app.use("/api/productos", productoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/categorias", categoriaRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});