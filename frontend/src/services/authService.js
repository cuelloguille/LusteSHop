const API_URL = "https://lusteshop-backend.onrender.com/api/auth";

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

export const solicitarRecuperacion = async (email) => {
    const respuesta = await fetch(`${API_URL}/solicitar-recuperacion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.mensaje || "Error al enviar el correo de recuperación");
    }

    return data;
};

export const resetPassword = async (token, password) => {
    const respuesta = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.mensaje || "Error al restablecer la contraseña");
    }

    return data;
};