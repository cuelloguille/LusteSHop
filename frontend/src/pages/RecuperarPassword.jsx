import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarRecuperacion } from "../services/authService";

function RecuperarPassword() {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMensaje("");
        setCargando(true);

        try {
            const data = await solicitarRecuperacion(email);
            setMensaje(data.mensaje || "Si existe la cuenta, te enviamos un correo");
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="password-page">
            <div className="password-card">
                <p className="page-eyebrow">RECUPERAR CONTRASEÑA</p>
                <h1>¿Olvidaste tu contraseña?</h1>
                <p>
                    Ingresá tu email y te enviaremos un enlace para restablecerla desde Gmail.
                </p>

                <form className="password-form" onSubmit={manejarSubmit}>
                    <input
                        className="input-field"
                        type="email"
                        placeholder="Tu email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <button className="button-primary" type="submit" disabled={cargando}>
                        {cargando ? "Enviando..." : "Enviar enlace"}
                    </button>
                </form>

                {mensaje && <div className="form-message">{mensaje}</div>}
                {error && <div className="form-error">{error}</div>}

                <div className="auth-helper-row">
                    <Link to="/login" className="inline-link">Volver al inicio de sesión</Link>
                </div>
            </div>
        </div>
    );
}

export default RecuperarPassword;
