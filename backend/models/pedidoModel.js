const pool = require("../config/database");

const crearPedido = async (datosCliente, productos) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verificar stock y obtener precios reales desde la base
        for (const item of productos) {
            const resultado = await client.query(
                `SELECT id, nombre, precio, stock
                 FROM productos
                 WHERE id = $1
                 FOR UPDATE`,
                [item.producto_id]
            );

            if (resultado.rows.length === 0) {
                throw new Error(`Producto ${item.producto_id} no existe`);
            }

            const producto = resultado.rows[0];

            if (producto.stock < item.cantidad) {
                throw new Error(
                    `Stock insuficiente para ${producto.nombre}`
                );
            }
        }

        // Calcular total usando los precios de la base
        let total = 0;

        const productosConPrecio = [];

        for (const item of productos) {
            const resultado = await client.query(
                `SELECT id, nombre, precio, stock
                 FROM productos
                 WHERE id = $1`,
                [item.producto_id]
            );

            const producto = resultado.rows[0];

            const subtotal =
                Number(producto.precio) * item.cantidad;

            total += subtotal;

            productosConPrecio.push({
                ...item,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                subtotal
            });
        }

        // Crear pedido
        const pedidoResultado = await client.query(
            `INSERT INTO pedidos (
                usuario_id,
                nombre_cliente,
                apellido_cliente,
                email_cliente,
                telefono_cliente,
                direccion_envio,
                ciudad_envio,
                codigo_postal,
                total
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                datosCliente.usuario_id || null,
                datosCliente.nombre,
                datosCliente.apellido,
                datosCliente.email,
                datosCliente.telefono,
                datosCliente.direccion,
                datosCliente.ciudad,
                datosCliente.codigo_postal,
                total
            ]
        );

        const pedido = pedidoResultado.rows[0];

        // Agregar productos al pedido y descontar stock
        for (const item of productosConPrecio) {
            await client.query(
                `INSERT INTO pedido_items (
                    pedido_id,
                    producto_id,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    pedido.id,
                    item.producto_id,
                    item.cantidad,
                    item.precio,
                    item.subtotal
                ]
            );

            await client.query(
                `UPDATE productos
                 SET stock = stock - $1
                 WHERE id = $2`,
                [item.cantidad, item.producto_id]
            );

            await client.query(
                `INSERT INTO movimientos_stock (
                    producto_id,
                    cantidad,
                    tipo,
                    descripcion
                )
                VALUES ($1, $2, $3, $4)`,
                [
                    item.producto_id,
                    -item.cantidad,
                    "venta",
                    `Venta del pedido #${pedido.id}`
                ]
            );
        }

        await client.query("COMMIT");

        return {
            pedido,
            productos: productosConPrecio
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
    
};

const obtenerPedidosPorUsuario = async (usuarioId) => {
    const resultado = await pool.query(
        `SELECT
            id,
            total,
            estado,
            fecha_creacion
         FROM pedidos
         WHERE usuario_id = $1
         ORDER BY fecha_creacion DESC`,
        [usuarioId]
    );

    return resultado.rows;
};

module.exports = {
    crearPedido,
    obtenerPedidosPorUsuario
};