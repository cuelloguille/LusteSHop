import { useState } from "react";
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
        <div>
            <h1>Crear cuenta</h1>

            <form onSubmit={manejarRegistro}>

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
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formulario.password}
                    onChange={manejarCambio}
                    required
                />

                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                />

                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formulario.direccion}
                    onChange={manejarCambio}
                />

                <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formulario.ciudad}
                    onChange={manejarCambio}
                />

                <input
                    type="text"
                    name="codigo_postal"
                    placeholder="Código postal"
                    value={formulario.codigo_postal}
                    onChange={manejarCambio}
                />

                <button type="submit">
                    Registrarme
                </button>

            </form>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default Registro;