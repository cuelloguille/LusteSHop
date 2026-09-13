import { Link } from "react-router-dom";

function PedidoConfirmado() {
    const pedidoGuardado =
        localStorage.getItem("ultimoPedido");

    if (!pedidoGuardado) {
        return (
            <div>
                <h1>No hay ningún pedido reciente</h1>

                <Link to="/">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    const data = JSON.parse(pedidoGuardado);
    const pedido = data.pedido;
    const productos = data.productos;

    return (
        <div>

            <h1>Pedido realizado</h1>

            <h2>
                Pedido #{pedido.id}
            </h2>

            <p>
                Total: ${pedido.total}
            </p>

            <h2>
                Productos
            </h2>

            {productos.map((producto) => (
                <div key={producto.producto_id}>

                    <p>
                        {producto.nombre}
                    </p>

                    <p>
                        Cantidad: {producto.cantidad}
                    </p>

                    <p>
                        Subtotal: ${producto.subtotal}
                    </p>

                </div>
            ))}

            <hr />

            <p>
                El pedido fue registrado correctamente.
            </p>

            <Link to="/">
                Volver a la tienda
            </Link>

        </div>
    );
}

export default PedidoConfirmado;