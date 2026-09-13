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
            } else if (
                formulario.imagen_url &&
                !formulario.imagen_url.startsWith("blob:") &&
                !formulario.imagen_url.startsWith("data:")
            ) {
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
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">ADMIN</p>
                        <h1 className="page-title">Cargando panel...</h1>
                    </div>
                </div>
            </div>
        );
    }

    if (!autorizado) {
        return (
            <div className="page-shell">
                <div className="page-container" style={{ maxWidth: "760px" }}>
                    <div className="page-card" style={{ padding: "36px" }}>
                        <p className="page-eyebrow">ADMIN</p>
                        <h1 className="page-title">Acceso restringido</h1>
                        <p className="page-subtitle" style={{ margin: "12px 0 22px" }}>{error}</p>
                        <button className="button-primary" onClick={() => navigate("/")}>
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-shell">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <p className="page-eyebrow">ADMIN</p>
                        <h1 className="page-title">Panel de administración</h1>
                    </div>

                    <div className="admin-actions">
                        <button className="button-primary" onClick={abrirNuevoProducto}>
                            + Nuevo producto
                        </button>
                        <button className="button-secondary" onClick={abrirNuevaCategoria}>
                            + Nueva categoría
                        </button>
                    </div>
                </div>

                {error && <div className="form-error">❌ {error}</div>}

                {mostrarCategoriaFormulario && (
                    <div className="admin-card admin-section">
                        <div className="admin-section-header">
                            <h2>
                                {editandoCategoriaId ? "Editar categoría" : "Nueva categoría"}
                            </h2>
                        </div>

                        <form className="admin-form" onSubmit={guardarCategoria}>
                            <input
                                className="admin-input"
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

                            <textarea
                                className="admin-textarea"
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

                            <div className="admin-actions">
                                <button type="submit" className="button-primary">
                                    {editandoCategoriaId ? "Guardar cambios" : "Crear categoría"}
                                </button>
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => {
                                        limpiarFormularioCategoria();
                                        setMostrarCategoriaFormulario(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {mostrarFormulario && (
                    <div className="admin-card admin-section">
                        <div className="admin-section-header">
                            <h2>
                                {editandoId ? "Editar producto" : "Nuevo producto"}
                            </h2>
                        </div>

                        <form className="admin-form" onSubmit={guardarProducto}>
                            <div className="admin-form-grid">
                                <input
                                    className="admin-input"
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />

                                <select
                                    className="admin-select"
                                    name="categoria_id"
                                    value={formulario.categoria_id}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccioná una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <textarea
                                className="admin-textarea"
                                name="descripcion"
                                placeholder="Descripción"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                            />

                            <div className="admin-form-grid">
                                <input
                                    className="admin-input"
                                    type="number"
                                    name="precio"
                                    placeholder="Precio"
                                    value={formulario.precio}
                                    onChange={manejarCambio}
                                    min="0"
                                    step="0.01"
                                    required
                                />

                                <input
                                    className="admin-input"
                                    type="number"
                                    name="stock"
                                    placeholder="Stock"
                                    value={formulario.stock}
                                    onChange={manejarCambio}
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    className="admin-input"
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

                                {formulario.imagen_url && (
                                    <div className="admin-preview">
                                        <img
                                            src={obtenerUrlImagen(formulario.imagen_url)}
                                            alt="Vista previa"
                                        />
                                        <button type="button" className="admin-danger-button" onClick={quitarImagen}>
                                            Quitar imagen
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="admin-actions">
                                <button type="submit" className="button-primary">
                                    {editandoId ? "Guardar cambios" : "Crear producto"}
                                </button>
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => {
                                        limpiarFormulario();
                                        setMostrarFormulario(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-card admin-section">
                    <div className="admin-section-header">
                        <h2>Categorías</h2>
                    </div>

                    {categorias.length === 0 ? (
                        <div className="admin-empty">No hay categorías cargadas.</div>
                    ) : (
                        <div className="admin-list">
                            {categorias.map((categoria) => (
                                <div className="admin-item" key={categoria.id}>
                                    <div className="admin-item-content">
                                        <h3>{categoria.nombre}</h3>
                                        <p>{categoria.descripcion || "Sin descripción"}</p>
                                    </div>

                                    <div></div>

                                    <div className="admin-item-actions">
                                        <button className="admin-mini-button" onClick={() => editarCategoria(categoria)}>
                                            Editar
                                        </button>
                                        <button className="admin-danger-button" onClick={() => eliminarCategoria(categoria.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-card admin-section">
                    <div className="admin-section-header">
                        <h2>Productos</h2>
                    </div>

                    {productos.length === 0 ? (
                        <div className="admin-empty">No hay productos cargados.</div>
                    ) : (
                        <div className="admin-list">
                            {productos.map((producto) => (
                                <div className="admin-item" key={producto.id}>
                                    {producto.imagen_url && (
                                        <img
                                            className="admin-item-image"
                                            src={obtenerUrlImagen(producto.imagen_url)}
                                            alt={producto.nombre}
                                        />
                                    )}

                                    {!producto.imagen_url && (
                                        <div className="admin-item-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#8a918c", fontSize: "12px" }}>
                                            SIN IMAGEN
                                        </div>
                                    )}

                                    <div className="admin-item-content">
                                        <h3>{producto.nombre}</h3>
                                        <p>{producto.descripcion || "Sin descripción"}</p>
                                        <p><strong>Precio:</strong> ${Number(producto.precio).toFixed(2)}</p>
                                        <p><strong>Stock:</strong> {producto.stock}</p>
                                        <p><strong>Categoría:</strong> {categorias.find((categoria) => categoria.id === producto.categoria_id)?.nombre || "Sin categoría"}</p>
                                    </div>

                                    <div className="admin-item-actions">
                                        <button className="admin-mini-button" onClick={() => editarProducto(producto)}>
                                            Editar
                                        </button>
                                        <button className="admin-danger-button" onClick={() => eliminarProducto(producto.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;