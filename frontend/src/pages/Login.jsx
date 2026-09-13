import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

            if (data.usuario?.rol === "admin") {
                navigate("/admin", {
                    replace: true,
                    state: {
                        mensaje: `Bienvenido ${data.usuario.nombre}`
                    }
                });
                return;
            }

            navigate("/", {
                replace: true,
                state: {
                    mensaje: `Bienvenido ${data.usuario.nombre}`
                }
            });

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="page-shell">
            <div className="page-container auth-layout">
                <div className="auth-visual">
                    <div className="auth-brand">
                        <span className="auth-brand-mark">L</span>
                        <span>LusteShop</span>
                    </div>

                    <div>
                        <p className="page-eyebrow" style={{ color: "#f0dfe2" }}>
                            BIENVENIDO
                        </p>
                        <h2>Ingresá a tu cuenta</h2>
                    </div>

                    <p>
                        Comprá rápido, guardá tus favoritos y seguí el estado de tus pedidos desde un solo lugar.
                    </p>

                    <div className="auth-badges">
                        <span className="auth-badge">SEGURA</span>
                        <span className="auth-badge">RÁPIDA</span>
                        <span className="auth-badge">FÁCIL</span>
                    </div>
                </div>

                <div className="auth-card">
                    <p className="page-eyebrow">INICIAR SESIÓN</p>
                    <h1 className="page-title" style={{ marginBottom: "24px" }}>Hola de nuevo</h1>

                    <form className="form-grid" onSubmit={manejarLogin}>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="input-field"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button className="button-primary" type="submit">
                            Iniciar sesión
                        </button>
                    </form>

                    {error && <div className="form-error">{error}</div>}

                    <div className="auth-helper-row">
                        <Link to="/recuperar-password" className="inline-link">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div style={{ marginTop: "20px", color: "#6d726d" }}>
                        ¿No tenés cuenta? <Link to="/registro" className="inline-link">Registrate</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;