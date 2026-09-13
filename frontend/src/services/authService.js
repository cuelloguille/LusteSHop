const API_URL = "http://localhost:3000/api/auth";

// Registrar usuario
export const registrarUsuario = async (datos) => {
    const respuesta = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.mensaje || "Error al registrar usuario");
    }

    return data;
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
    }

    return data;
};