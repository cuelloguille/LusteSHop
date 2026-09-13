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

            // Guardamos los datos necesarios
            setWhatsappUrl(data.whatsappUrl);
            setNumeroPedido(data.pedido.id);

            // Vaciamos el carrito
            vaciarCarrito();

            // Guardamos el último pedido
            localStorage.setItem(
                "ultimoPedido",
                JSON.stringify(data)
            );

            // Mostramos confirmación
            setPedidoConfirmado(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    // PANTALLA DE PEDIDO CONFIRMADO
    if (pedidoConfirmado) {
        return (
            <div>
                <h1>✅ Pedido confirmado</h1>

                <h2>
                    Pedido #{numeroPedido}
                </h2>

                <p>
                    Tu pedido fue registrado correctamente.
                </p>

                

                <br />

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button>
                        📱 Enviar pedido por WhatsApp
                    </button>
                </a>

                <br />
                <br />

                <button onClick={() => navigate("/")}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    // CARRITO VACÍO
    if (carrito.length === 0) {
        return (
            <div>
                <h1>Checkout</h1>

                <p>
                    No hay productos en el carrito.
                </p>

                <Link to="/">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    // CHECKOUT
    return (
        <div>

            <h1>Finalizar compra</h1>

            <form onSubmit={confirmarPedido}>

                <h2>Datos del cliente</h2>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formulario.apellido}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formulario.email}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                    required
                />

                <h2>Datos de envío</h2>

                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formulario.direccion}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formulario.ciudad}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="text"
                    name="codigo_postal"
                    placeholder="Código postal"
                    value={formulario.codigo_postal}
                    onChange={manejarCambio}
                    required
                />

                <h2>
                    Total: ${precioTotal.toFixed(2)}
                </h2>

                {error && (
                    <p>
                        ❌ {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={cargando}
                >
                    {cargando
                        ? "Procesando..."
                        : "Confirmar pedido"}
                </button>

            </form>

        </div>
    );
}

export default Checkout;