import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import PedidoConfirmado from "./pages/PedidoConfirmado";
import MisPedidos from "./pages/MisPedidos";
import Admin from "./pages/Admin";

function App() {
    const [usuario, setUsuario] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("usuario") || "null");
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const actualizarUsuario = () => {
            try {
                setUsuario(JSON.parse(localStorage.getItem("usuario") || "null"));
            } catch {
                setUsuario(null);
            }
        };

        window.addEventListener("storage", actualizarUsuario);
        window.addEventListener("usuario-cambio", actualizarUsuario);

        return () => {
            window.removeEventListener("storage", actualizarUsuario);
            window.removeEventListener("usuario-cambio", actualizarUsuario);
        };
    }, []);

    const esAdmin = usuario?.rol === "admin";

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/registro"
                    element={<Registro />}
                />

                <Route
                    path="/carrito"
                    element={<Carrito />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/pedido-confirmado"
                    element={<PedidoConfirmado />}
                />

                <Route
                    path="/mis-pedidos"
                    element={<MisPedidos />}
                />

                <Route
                    path="/admin"
                    element={
                        esAdmin ? <Admin /> : <Navigate to="/" replace />
                    }
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;