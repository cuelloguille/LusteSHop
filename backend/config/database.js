const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? {
              rejectUnauthorized: false
          }
        : false
});

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                telefono VARCHAR(50),
                direccion TEXT,
                ciudad VARCHAR(100),
                codigo_postal VARCHAR(30),
                rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
                fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS categorias (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                descripcion TEXT,
                fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                descripcion TEXT,
                precio NUMERIC(10,2) NOT NULL DEFAULT 0,
                stock INTEGER NOT NULL DEFAULT 0,
                categoria_id INTEGER,
                imagen_url TEXT DEFAULT '',
                activo BOOLEAN NOT NULL DEFAULT true,
                fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_productos_categoria
                    FOREIGN KEY (categoria_id)
                    REFERENCES categorias(id)
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS pedidos (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER,
                nombre_cliente VARCHAR(100) NOT NULL,
                apellido_cliente VARCHAR(100) NOT NULL,
                email_cliente VARCHAR(255) NOT NULL,
                telefono_cliente VARCHAR(50),
                direccion_envio TEXT NOT NULL,
                ciudad_envio VARCHAR(100) NOT NULL,
                codigo_postal VARCHAR(30),
                total NUMERIC(10,2) NOT NULL DEFAULT 0,
                estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
                fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_pedidos_usuario
                    FOREIGN KEY (usuario_id)
                    REFERENCES usuarios(id)
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS pedido_items (
                id SERIAL PRIMARY KEY,
                pedido_id INTEGER NOT NULL,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario NUMERIC(10,2) NOT NULL,
                subtotal NUMERIC(10,2) NOT NULL,
                CONSTRAINT fk_pedido_items_pedido
                    FOREIGN KEY (pedido_id)
                    REFERENCES pedidos(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_pedido_items_producto
                    FOREIGN KEY (producto_id)
                    REFERENCES productos(id)
                    ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id SERIAL PRIMARY KEY,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                tipo VARCHAR(30) NOT NULL,
                descripcion TEXT,
                fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_movimientos_producto
                    FOREIGN KEY (producto_id)
                    REFERENCES productos(id)
                    ON DELETE CASCADE
            );
        `);

        console.log("Base de datos verificada e inicializada correctamente");
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        throw error;
    }
};

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;