import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const data = await iniciarSesion(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "usuario",
                JSON.stringify(data.usuario)
            );

            window.dispatchEvent(new Event("usuario-cambio"));

            alert("Inicio de sesión correcto");

            if (data.usuario?.rol === "admin") {
                navigate("/admin", { replace: true });
                return;
            }

            navigate("/", { replace: true });

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Iniciar sesión</h1>

            <form onSubmit={manejarLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Iniciar sesión
                </button>

            </form>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;