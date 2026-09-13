import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Tenés que iniciar sesión para ver tus compras");
            setCargando(false);
            return;
        }

        fetch("http://localhost:3000/api/pedidos/mis-pedidos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (respuesta) => {
                const data = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        data.mensaje || "Error al obtener pedidos"
                    );
                }

                return data;
            })
            .then((data) => {
                setPedidos(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    if (cargando) {
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">MIS COMPRAS</p>
                        <h1 className="page-title">Cargando pedidos...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="page-container" style={{ maxWidth: "960px" }}>
                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">MIS COMPRAS</p>
                        <h1 className="page-title">Tus pedidos</h1>
                    </div>
                    <Link to="/" className="button-link">← Seguir comprando</Link>
                </div>

                {error && <div className="form-error">❌ {error}</div>}

                {!error && pedidos.length === 0 && (
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-subtitle" style={{ marginBottom: "20px" }}>
                            Todavía no realizaste ninguna compra.
                        </p>
                        <Link to="/" className="button-primary">Ir a la tienda</Link>
                    </div>
                )}

                <div className="card-list">
                    {pedidos.map((pedido) => (
                        <div className="card-item" key={pedido.id}>
                            <div>
                                <strong>Pedido #{pedido.id}</strong>
                                <span>Estado: {pedido.estado}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <strong>${Number(pedido.total).toFixed(2)}</strong>
                                <span>{new Date(pedido.fecha_creacion).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MisPedidos;