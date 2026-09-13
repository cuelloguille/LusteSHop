
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./css/Carrito.css";

function Carrito() {
    const {
        carrito,
        quitarDelCarrito,
        cambiarCantidad,
        precioTotal,
        cantidadTotal
    } = useCarrito();

    if (carrito.length === 0) {
        return (
            <div className="carrito-pagina">
                <div className="carrito-vacio">
                    <div className="carrito-icono">
                        🛒
                    </div>

                    <h1>Tu carrito está vacío</h1>

                    <p>
                        Todavía no agregaste ningún producto.
                    </p>

                    <Link to="/" className="boton-principal">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="carrito-pagina">

            <div className="carrito-contenedor">

                <div className="carrito-header">
                    <div>
                        <p className="carrito-superior">
                            LUSTESHOP
                        </p>

                        <h1>Tu carrito</h1>

                        <p className="carrito-descripcion">
                            {cantidadTotal} producto
                            {cantidadTotal !== 1 ? "s" : ""} en tu carrito
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="volver-tienda"
                    >
                        ← Seguir comprando
                    </Link>
                </div>

                <div className="carrito-layout">

                    <div className="productos-carrito">

                        {carrito.map((producto) => (
                            <div
                                className="producto-carrito"
                                key={producto.id}
                            >

                                <div className="producto-info">

                                    <div className="producto-imagen">
                                        <span>🛍️</span>
                                    </div>

                                    <div className="producto-datos">

                                        <h2>
                                            {producto.nombre}
                                        </h2>

                                        <p className="producto-precio">
                                            ${Number(producto.precio).toFixed(2)}
                                        </p>

                                        <p className="producto-stock">
                                            Stock disponible: {producto.stock}
                                        </p>

                                    </div>

                                </div>

                                <div className="producto-acciones">

                                    <div className="cantidad-control">

                                        <button
                                            onClick={() =>
                                                cambiarCantidad(
                                                    producto.id,
                                                    producto.cantidad - 1
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {producto.cantidad}
                                        </span>

                                        <button
                                            onClick={() =>
                                                cambiarCantidad(
                                                    producto.id,
                                                    producto.cantidad + 1
                                                )
                                            }
                                            disabled={
                                                producto.cantidad >=
                                                producto.stock
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <p className="producto-subtotal">
                                        $
                                        {(
                                            Number(producto.precio) *
                                            producto.cantidad
                                        ).toFixed(2)}
                                    </p>

                                    <button
                                        className="boton-eliminar"
                                        onClick={() =>
                                            quitarDelCarrito(producto.id)
                                        }
                                    >
                                        Eliminar
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                    <aside className="resumen-carrito">

                        <p className="resumen-titulo">
                            RESUMEN
                        </p>

                        <h2>
                            Tu pedido
                        </h2>

                        <div className="resumen-linea">
                            <span>
                                Productos
                            </span>

                            <span>
                                {cantidadTotal}
                            </span>
                        </div>

                        <div className="resumen-linea">
                            <span>
                                Subtotal
                            </span>

                            <span>
                                ${precioTotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="resumen-separador"></div>

                        <div className="resumen-total">
                            <span>
                                Total
                            </span>

                            <span>
                                ${precioTotal.toFixed(2)}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className="boton-checkout"
                        >
                            Confirmar pedido
                            <span>→</span>
                        </Link>

                        <p className="mensaje-seguridad">
                            Compra rápida y segura
                        </p>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default Carrito;
