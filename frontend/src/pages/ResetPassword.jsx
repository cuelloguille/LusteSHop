import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMensaje("");

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!token) {
            setError("El enlace de recuperación no es válido");
            return;
        }

        setCargando(true);

        try {
            const data = await resetPassword(token, password);
            setMensaje(data.mensaje || "Contraseña actualizada correctamente");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1800);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="password-page">
            <div className="password-card">
                <p className="page-eyebrow">NUEVA CONTRASEÑA</p>
                <h1>Restablecer contraseña</h1>
                <p>
                    Elegí una nueva contraseña para continuar con tu cuenta.
                </p>

                {!token ? (
                    <div className="form-error">
                        No se encontró un enlace válido para restablecer la contraseña.
                    </div>
                ) : (
                    <form className="password-form" onSubmit={manejarSubmit}>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <input
                            className="input-field"
                            type="password"
                            placeholder="Repetir contraseña"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />

                        <button className="button-primary" type="submit" disabled={cargando}>
                            {cargando ? "Guardando..." : "Guardar contraseña"}
                        </button>
                    </form>
                )}

                {mensaje && <div className="form-message">{mensaje}</div>}
                {error && <div className="form-error">{error}</div>}

                <div className="auth-helper-row">
                    <Link to="/login" className="inline-link">Volver al login</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
