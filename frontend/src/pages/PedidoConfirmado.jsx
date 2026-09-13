import { Link } from "react-router-dom";

function PedidoConfirmado() {
    const pedidoGuardado =
        localStorage.getItem("ultimoPedido");

    if (!pedidoGuardado) {
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">PEDIDO</p>
                        <h1 className="page-title">No hay ningún pedido reciente</h1>
                        <Link to="/" className="button-primary" style={{ marginTop: "20px" }}>Volver a la tienda</Link>
                    </div>
                </div>
            </div>
        );
    }

    const data = JSON.parse(pedidoGuardado);
    const pedido = data.pedido;
    const productos = data.productos;

    return (
        <div className="page-shell">
            <div className="page-container" style={{ maxWidth: "960px" }}>
                <div className="page-card" style={{ padding: "36px" }}>
                    <p className="page-eyebrow">PEDIDO CONFIRMADO</p>
                    <h1 className="page-title" style={{ marginBottom: "12px" }}>Pedido realizado</h1>

                    <div className="summary-card" style={{ marginTop: "20px" }}>
                        <div className="summary-row">
                            <span>Pedido</span>
                            <strong>#{pedido.id}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Total</span>
                            <strong>${pedido.total}</strong>
                        </div>
                    </div>

                    <h2 style={{ margin: "26px 0 18px" }}>Productos</h2>

                    <div className="card-list">
                        {productos.map((producto) => (
                            <div className="card-item" key={producto.producto_id}>
                                <div>
                                    <strong>{producto.nombre}</strong>
                                    <span>Cantidad: {producto.cantidad}</span>
                                </div>
                                <span><strong>${producto.subtotal}</strong></span>
                            </div>
                        ))}
                    </div>

                    <p className="page-subtitle" style={{ marginTop: "26px" }}>
                        El pedido fue registrado correctamente.
                    </p>

                    <Link to="/" className="button-primary" style={{ marginTop: "20px" }}>
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PedidoConfirmado;