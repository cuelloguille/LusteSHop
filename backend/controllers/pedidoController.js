const pedidoModel = require("../models/pedidoModel");

const crearPedido = async (req, res) => {
    try {
        const {
            usuario_id,
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            ciudad,
            codigo_postal,
            productos
        } = req.body;

        if (
            !nombre ||
            !apellido ||
            !direccion ||
            !ciudad ||
            !codigo_postal
        ) {
            return res.status(400).json({
                mensaje: "Faltan datos de envío"
            });
        }

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                mensaje: "El carrito está vacío"
            });
        }

        const resultado = await pedidoModel.crearPedido(
            {
                usuario_id,
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                ciudad,
                codigo_postal
            },
            productos
        );

        const pedido = resultado.pedido;
        const productosPedido = resultado.productos;

        // Crear mensaje para WhatsApp
        let mensaje = `Hola, quiero confirmar mi pedido #%${pedido.id}\n\n`;

        mensaje = `Hola, quiero confirmar mi pedido #${pedido.id}\n\n`;

        mensaje += `*Cliente:* ${nombre} ${apellido}\n`;
        mensaje += `*Teléfono:* ${telefono}\n`;
        mensaje += `*Dirección:* ${direccion}\n`;
        mensaje += `*Ciudad:* ${ciudad}\n`;
        mensaje += `*Código postal:* ${codigo_postal}\n\n`;

        mensaje += `*Productos:*\n`;

        productosPedido.forEach((producto) => {
            mensaje += `- ${producto.nombre} x${producto.cantidad} = $${producto.subtotal.toFixed(2)}\n`;
        });

        mensaje += `\n*Total: $${Number(pedido.total).toFixed(2)}*`;

        // IMPORTANTE:
        // Reemplazá este número por el WhatsApp de tu negocio.
        const numeroWhatsApp = "5493584026789";

        const whatsappUrl =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido,
            productos: productosPedido,
            whatsappUrl
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            mensaje: error.message
        });
    }
};

const obtenerMisPedidos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const pedidos =
            await pedidoModel.obtenerPedidosPorUsuario(usuarioId);

        res.json(pedidos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los pedidos"
        });
    }
};

module.exports = {
    crearPedido,
    obtenerMisPedidos
};