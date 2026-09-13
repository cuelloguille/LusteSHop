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
            <div>
                <h1>Mis compras</h1>
                <p>Cargando pedidos...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Mis compras</h1>

            {error && (
                <p>
                    ❌ {error}
                </p>
            )}

            {!error && pedidos.length === 0 && (
                <div>
                    <p>
                        Todavía no realizaste ninguna compra.
                    </p>

                    <Link to="/">
                        Ir a la tienda
                    </Link>
                </div>
            )}

            {pedidos.map((pedido) => (
                <div key={pedido.id}>

                    <h2>
                        Pedido #{pedido.id}
                    </h2>

                    <p>
                        Total: $
                        {Number(pedido.total).toFixed(2)}
                    </p>

                    <p>
                        Estado: {pedido.estado}
                    </p>

                    <p>
                        Fecha:{" "}
                        {new Date(
                            pedido.fecha_creacion
                        ).toLocaleString()}
                    </p>

                    <hr />

                </div>
            ))}
        </div>
    );
}

export default MisPedidos;