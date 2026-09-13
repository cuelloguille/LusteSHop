import { useState } from "react";
import { Link } from "react-router-dom";
import { registrarUsuario } from "../services/authService";

function Registro() {
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        codigo_postal: ""
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarRegistro = async (e) => {
        e.preventDefault();

        setMensaje("");
        setError("");

        try {
            await registrarUsuario(formulario);

            setMensaje("Usuario registrado correctamente");

            setFormulario({
                nombre: "",
                apellido: "",
                email: "",
                password: "",
                telefono: "",
                direccion: "",
                ciudad: "",
                codigo_postal: ""
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
                            CREA TU CUENTA
                        </p>
                        <h2>Unite a la comunidad</h2>
                    </div>

                    <p>
                        Registrate para comprar más rápido, seguir tus pedidos y recibir ofertas exclusivas.
                    </p>

                    <div className="auth-badges">
                        <span className="auth-badge">PREMIUM</span>
                        <span className="auth-badge">ENVÍOS</span>
                        <span className="auth-badge">SEGURIDAD</span>
                    </div>
                </div>

                <div className="auth-card">
                    <p className="page-eyebrow">REGISTRARSE</p>
                    <h1 className="page-title" style={{ marginBottom: "24px" }}>Crear cuenta</h1>

                    <form className="form-grid" onSubmit={manejarRegistro}>
                        <div className="form-grid two-columns">
                            <input
                                className="input-field"
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                required
                            />

                            <input
                                className="input-field"
                                type="text"
                                name="apellido"
                                placeholder="Apellido"
                                value={formulario.apellido}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <input
                            className="input-field"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formulario.email}
                            onChange={manejarCambio}
                            required
                        />

                        <input
                            className="input-field"
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formulario.password}
                            onChange={manejarCambio}
                            required
                        />

                        <input
                            className="input-field"
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formulario.telefono}
                            onChange={manejarCambio}
                        />

                        <input
                            className="input-field"
                            type="text"
                            name="direccion"
                            placeholder="Dirección"
                            value={formulario.direccion}
                            onChange={manejarCambio}
                        />

                        <div className="form-grid two-columns">
                            <input
                                className="input-field"
                                type="text"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={formulario.ciudad}
                                onChange={manejarCambio}
                            />

                            <input
                                className="input-field"
                                type="text"
                                name="codigo_postal"
                                placeholder="Código postal"
                                value={formulario.codigo_postal}
                                onChange={manejarCambio}
                            />
                        </div>

                        <button className="button-primary" type="submit">
                            Registrarme
                        </button>
                    </form>

                    {mensaje && <div className="form-message">{mensaje}</div>}
                    {error && <div className="form-error">{error}</div>}

                    <div style={{ marginTop: "20px", color: "#6d726d" }}>
                        ¿Ya tenés cuenta? <Link to="/login" className="inline-link">Iniciá sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;