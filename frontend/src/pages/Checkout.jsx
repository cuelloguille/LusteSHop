import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

function Checkout() {
    const {
        carrito,
        precioTotal,
        vaciarCarrito
    } = useCarrito();

    const navigate = useNavigate();

    const usuarioGuardado = localStorage.getItem("usuario");

    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;

    const [formulario, setFormulario] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        email: usuario?.email || "",
        telefono: usuario?.telefono || "",
        direccion: usuario?.direccion || "",
        ciudad: usuario?.ciudad || "",
        codigo_postal: usuario?.codigo_postal || ""
    });

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState("");
    const [numeroPedido, setNumeroPedido] = useState("");

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const confirmarPedido = async (e) => {
        e.preventDefault();

        setError("");
        setCargando(true);

        try {
            const productos = carrito.map((producto) => ({
                producto_id: producto.id,
                cantidad: producto.cantidad
            }));

            const respuesta = await fetch(
                "http://localhost:3000/api/pedidos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario_id: usuario?.id || null,
                        ...formulario,
                        productos
                    })
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "No se pudo crear el pedido"
                );
            }

            setWhatsappUrl(data.whatsappUrl);
            setNumeroPedido(data.pedido.id);

            vaciarCarrito();

            localStorage.setItem(
                "ultimoPedido",
                JSON.stringify(data)
            );

            setPedidoConfirmado(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    if (pedidoConfirmado) {
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">PEDIDO CONFIRMADO</p>
                        <h1 className="page-title" style={{ marginBottom: "10px" }}>✅ Pedido realizado</h1>

                        <h2 style={{ margin: "0 0 10px" }}>Pedido #{numeroPedido}</h2>
                        <p className="page-subtitle" style={{ marginBottom: "20px" }}>
                            Tu pedido fue registrado correctamente.
                        </p>

                        <div className="form-actions" style={{ justifyContent: "flex-start", marginTop: "24px" }}>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="button-primary">
                                📱 Enviar por WhatsApp
                            </a>
                            <button className="button-secondary" onClick={() => navigate("/")}>
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (carrito.length === 0) {
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">CHECKOUT</p>
                        <h1 className="page-title" style={{ marginBottom: "12px" }}>Tu carrito está vacío</h1>
                        <p className="page-subtitle" style={{ marginBottom: "20px" }}>
                            No hay productos en el carrito.
                        </p>
                        <Link to="/" className="button-primary">Volver a la tienda</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="page-container" style={{ maxWidth: "1180px" }}>
                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">CHECKOUT</p>
                        <h1 className="page-title">Finalizar compra</h1>
                    </div>
                    <Link to="/carrito" className="button-link">← Volver al carrito</Link>
                </div>

                <div className="auth-layout" style={{ alignItems: "start" }}>
                    <div className="auth-card">
                        <form className="form-grid" onSubmit={confirmarPedido}>
                            <div>
                                <h2 style={{ margin: "0 0 16px" }}>Datos del cliente</h2>
                                <div className="form-grid two-columns">
                                    <input className="input-field" type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} required />
                                    <input className="input-field" type="text" name="apellido" placeholder="Apellido" value={formulario.apellido} onChange={manejarCambio} required />
                                </div>
                            </div>

                            <div className="form-grid two-columns">
                                <input className="input-field" type="email" name="email" placeholder="Email" value={formulario.email} onChange={manejarCambio} required />
                                <input className="input-field" type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={manejarCambio} required />
                            </div>

                            <div>
                                <h2 style={{ margin: "0 0 16px" }}>Datos de envío</h2>
                                <input className="input-field" type="text" name="direccion" placeholder="Dirección" value={formulario.direccion} onChange={manejarCambio} required />
                            </div>

                            <div className="form-grid two-columns">
                                <input className="input-field" type="text" name="ciudad" placeholder="Ciudad" value={formulario.ciudad} onChange={manejarCambio} required />
                                <input className="input-field" type="text" name="codigo_postal" placeholder="Código postal" value={formulario.codigo_postal} onChange={manejarCambio} required />
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <button className="button-primary" type="submit" disabled={cargando}>
                                {cargando ? "Procesando..." : "Confirmar pedido"}
                            </button>
                        </form>
                    </div>

                    <aside className="summary-card">
                        <p className="page-eyebrow">RESUMEN</p>
                        <h2 style={{ margin: "0 0 20px" }}>Tu pedido</h2>

                        {carrito.map((producto) => (
                            <div key={producto.id} className="summary-row">
                                <span>{producto.nombre} x {producto.cantidad}</span>
                                <span>${(Number(producto.precio) * producto.cantidad).toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="summary-row total">
                            <span>Total</span>
                            <strong>${precioTotal.toFixed(2)}</strong>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default Checkout;