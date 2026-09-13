import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const obtenerUrlImagen = (imagenUrl) => {
    if (!imagenUrl) return "";

    if (imagenUrl.startsWith("http")) {
        return imagenUrl;
    }

    if (imagenUrl.startsWith("/uploads/")) {
        return `${API_BASE_URL}${imagenUrl}`;
    }

    return imagenUrl;
};

function Admin() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
    const [autorizado, setAutorizado] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarCategoriaFormulario, setMostrarCategoriaFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria_id: "",
        imagen_url: "",
        imagen_archivo: null
    });

    const [categoriaFormulario, setCategoriaFormulario] = useState({
        nombre: "",
        descripcion: ""
    });

    const cargarProductos = async () => {
        try {
            const respuesta = await fetch(
                `${API_BASE_URL}/api/productos`
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "Error al obtener productos"
                );
            }

            setProductos(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const cargarCategorias = async () => {
        try {
            const respuesta = await fetch(
                `${API_BASE_URL}/api/categorias`
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "Error al obtener categorías"
                );
            }

            setCategorias(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            const usuario = JSON.parse(
                localStorage.getItem("usuario") || "null"
            );

            if (!usuario || usuario.rol !== "admin") {
                setError("No tienes permisos para acceder al panel de administración.");
                setAutorizado(false);
                setCargando(false);
                navigate("/", { replace: true });
                return;
            }

            setAutorizado(true);

            await Promise.all([
                cargarProductos(),
                cargarCategorias()
            ]);

            setCargando(false);
        };

        cargarDatos();
    }, [navigate]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoria_id: "",
            imagen_url: "",
            imagen_archivo: null
        });

        setEditandoId(null);
    };

    const limpiarFormularioCategoria = () => {
        setCategoriaFormulario({
            nombre: "",
            descripcion: ""
        });

        setEditandoCategoriaId(null);
    };

    const abrirNuevoProducto = () => {
        limpiarFormulario();
        setMostrarFormulario(true);
    };

    const abrirNuevaCategoria = () => {
        limpiarFormularioCategoria();
        setMostrarCategoriaFormulario(true);
    };

    const editarProducto = (producto) => {
        setFormulario({
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio: producto.precio,
            stock: producto.stock,
            categoria_id: producto.categoria_id
                ? String(producto.categoria_id)
                : "",
            imagen_url: producto.imagen_url || "",
            imagen_archivo: null
        });

        setEditandoId(producto.id);
        setMostrarFormulario(true);
    };

    const quitarImagen = () => {
        setFormulario({
            ...formulario,
            imagen_url: "",
            imagen_archivo: null
        });
    };

    const editarCategoria = (categoria) => {
        setCategoriaFormulario({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || ""
        });

        setEditandoCategoriaId(categoria.id);
        setMostrarCategoriaFormulario(true);
    };

    const guardarProducto = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!formulario.categoria_id) {
            alert("Seleccioná una categoría");
            return;
        }

        try {
            const url = editandoId
                ? `${API_BASE_URL}/api/productos/${editandoId}`
                : `${API_BASE_URL}/api/productos`;

            const metodo = editandoId ? "PUT" : "POST";
            const formData = new FormData();

            formData.append("nombre", formulario.nombre);
            formData.append("descripcion", formulario.descripcion || "");
            formData.append("precio", String(Number(formulario.precio)));
            formData.append("stock", String(Number(formulario.stock)));
            formData.append("categoria_id", String(Number(formulario.categoria_id)));

            if (formulario.imagen_archivo) {
                formData.append("imagen", formulario.imagen_archivo);
            } else if (editandoId && formulario.imagen_url === "") {
                formData.append("imagen_url", "");
            } else if (formulario.imagen_url) {
                formData.append("imagen_url", formulario.imagen_url);
            }

            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "No se pudo guardar el producto"
                );
            }

            if (editandoId) {
                setProductos(
                    productos.map((producto) =>
                        producto.id === editandoId
                            ? data
                            : producto
                    )
                );
            } else {
                setProductos([
                    ...productos,
                    data
                ]);
            }

            limpiarFormulario();
            setMostrarFormulario(false);

        } catch (error) {
            alert(error.message);
        }
    };

    const eliminarProducto = async (id) => {
        const token = localStorage.getItem("token");

        const confirmar = window.confirm(
            "¿Seguro que querés eliminar este producto?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_BASE_URL}/api/productos/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "No se pudo eliminar"
                );
            }

            setProductos(
                productos.filter(
                    (producto) => producto.id !== id
                )
            );

        } catch (error) {
            alert(error.message);
        }
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const url = editandoCategoriaId
                ? `${API_BASE_URL}/api/categorias/${editandoCategoriaId}`
                : `${API_BASE_URL}/api/categorias`;

            const metodo = editandoCategoriaId ? "PUT" : "POST";

            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: categoriaFormulario.nombre,
                    descripcion: categoriaFormulario.descripcion
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "No se pudo guardar la categoría"
                );
            }

            if (editandoCategoriaId) {
                setCategorias(
                    categorias.map((categoria) =>
                        categoria.id === editandoCategoriaId
                            ? data
                            : categoria
                    )
                );
            } else {
                setCategorias([...categorias, data]);
            }

            limpiarFormularioCategoria();
            setMostrarCategoriaFormulario(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const eliminarCategoria = async (id) => {
        const token = localStorage.getItem("token");

        const confirmar = window.confirm(
            "¿Seguro que querés eliminar esta categoría?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_BASE_URL}/api/categorias/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.mensaje || "No se pudo eliminar la categoría"
                );
            }

            setCategorias(
                categorias.filter((categoria) => categoria.id !== id)
            );
        } catch (error) {
            alert(error.message);
        }
    };

    if (cargando) {
        return <p>Cargando...</p>;
    }

    if (!autorizado) {
        return (
            <div>
                <h1>Panel de administración</h1>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div>

            <h1>Panel de administración</h1>

            {error && (
                <p>❌ {error}</p>
            )}

            <button onClick={abrirNuevoProducto}>
                + Nuevo producto
            </button>

            {" "}

            <button onClick={abrirNuevaCategoria}>
                + Nueva categoría
            </button>

            <br />
            <br />

            {mostrarCategoriaFormulario && (
                <div>
                    <h2>
                        {editandoCategoriaId
                            ? "Editar categoría"
                            : "Nueva categoría"}
                    </h2>

                    <form onSubmit={guardarCategoria}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre de la categoría"
                            value={categoriaFormulario.nombre}
                            onChange={(e) =>
                                setCategoriaFormulario({
                                    ...categoriaFormulario,
                                    nombre: e.target.value
                                })
                            }
                            required
                        />

                        <br />

                        <textarea
                            name="descripcion"
                            placeholder="Descripción"
                            value={categoriaFormulario.descripcion}
                            onChange={(e) =>
                                setCategoriaFormulario({
                                    ...categoriaFormulario,
                                    descripcion: e.target.value
                                })
                            }
                        />

                        <br />

                        <button type="submit">
                            {editandoCategoriaId
                                ? "Guardar cambios"
                                : "Crear categoría"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={() => {
                                limpiarFormularioCategoria();
                                setMostrarCategoriaFormulario(false);
                            }}
                        >
                            Cancelar
                        </button>
                    </form>

                    <br />
                </div>
            )}

            {mostrarFormulario && (
                <div>

                    <h2>
                        {editandoId
                            ? "Editar producto"
                            : "Nuevo producto"}
                    </h2>

                    <form onSubmit={guardarProducto}>

                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            required
                        />

                        <br />

                        <textarea
                            name="descripcion"
                            placeholder="Descripción"
                            value={formulario.descripcion}
                            onChange={manejarCambio}
                        />

                        <br />

                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={formulario.precio}
                            onChange={manejarCambio}
                            min="0"
                            step="0.01"
                            required
                        />

                        <br />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formulario.stock}
                            onChange={manejarCambio}
                            min="0"
                            required
                        />

                        <br />

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const archivo = e.target.files?.[0] || null;

                                setFormulario({
                                    ...formulario,
                                    imagen_archivo: archivo,
                                    imagen_url: archivo
                                        ? URL.createObjectURL(archivo)
                                        : formulario.imagen_url
                                });
                            }}
                        />

                        <br />

                        {formulario.imagen_url && (
                            <>
                                <img
                                    src={obtenerUrlImagen(formulario.imagen_url)}
                                    alt="Vista previa"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        display: "block",
                                        marginBottom: "10px"
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={quitarImagen}
                                    style={{ marginBottom: "10px" }}
                                >
                                    Quitar imagen
                                </button>
                            </>
                        )}

                        <br />

                        <label>
                            Categoría:
                        </label>

                        <br />

                        <select
                            name="categoria_id"
                            value={formulario.categoria_id}
                            onChange={manejarCambio}
                            required
                        >
                            <option value="">
                                Seleccioná una categoría
                            </option>

                            {categorias.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>

                        <br />
                        <br />

                        <button type="submit">
                            {editandoId
                                ? "Guardar cambios"
                                : "Crear producto"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={() => {
                                limpiarFormulario();
                                setMostrarFormulario(false);
                            }}
                        >
                            Cancelar
                        </button>

                    </form>

                </div>
            )}

            <hr />

            <h2>Categorías</h2>

            {categorias.map((categoria) => (
                <div key={categoria.id}>
                    <h3>{categoria.nombre}</h3>
                    <p>{categoria.descripcion || "Sin descripción"}</p>

                    <button onClick={() => editarCategoria(categoria)}>
                        Editar
                    </button>

                    {" "}

                    <button onClick={() => eliminarCategoria(categoria.id)}>
                        Eliminar
                    </button>

                    <hr />
                </div>
            ))}

            <hr />

            <h2>Productos</h2>

            {productos.map((producto) => (
                <div key={producto.id}>

                    {producto.imagen_url && (
                        <img
                            src={obtenerUrlImagen(producto.imagen_url)}
                            alt={producto.nombre}
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    )}

                    <h3>
                        {producto.nombre}
                    </h3>

                    <p>
                        {producto.descripcion}
                    </p>

                    <p>
                        Precio: $
                        {Number(producto.precio).toFixed(2)}
                    </p>

                    <p>
                        Stock: {producto.stock}
                    </p>

                    <p>
                        Categoría:{" "}
                        {
                            categorias.find(
                                (categoria) =>
                                    categoria.id === producto.categoria_id
                            )?.nombre
                        }
                    </p>

                    <button
                        onClick={() =>
                            editarProducto(producto)
                        }
                    >
                        Editar
                    </button>

                    {" "}

                    <button
                        onClick={() =>
                            eliminarProducto(producto.id)
                        }
                    >
                        Eliminar
                    </button>

                    <hr />

                </div>
            ))}

        </div>
    );
}

export default Admin;