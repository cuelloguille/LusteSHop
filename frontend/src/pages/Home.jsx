
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./css/Home.css";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

function Home() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");

    const [usuario, setUsuario] = useState(() => {
        return JSON.parse(
            localStorage.getItem("usuario") || "null"
        );
    });

    const navigate = useNavigate();

    const {
        agregarAlCarrito,
        cantidadTotal
    } = useCarrito();

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch(
                    `${API_BASE_URL}/api/productos`
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron cargar los productos"
                    );
                }

                const data = await respuesta.json();

                setProductos(data);

            } catch (error) {
                console.error(error);

                setError(
                    "No se pudieron cargar los productos"
                );
            }
        };

        cargarProductos();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);

        navigate("/");
    };

    return (
        <div className="home-page">

            {/* NAVBAR */}

            <header className="navbar">

                <div className="navbar-container">

                    <Link
                        to="/"
                        className="logo"
                    >
                        <span className="logo-icon">
                            L
                        </span>

                        <span className="logo-text">
                            LusteShop
                        </span>
                    </Link>

                    <nav className="navbar-links">

                        <Link
                            to="/"
                            className="navbar-link active"
                        >
                            Inicio
                        </Link>

                        {usuario && (
                            <Link
                                to="/mis-pedidos"
                                className="navbar-link"
                            >
                                Mis compras
                            </Link>
                        )}

                        {usuario?.rol === "admin" && (
                            <Link
                                to="/admin"
                                className="navbar-link"
                            >
                                Administración
                            </Link>
                        )}

                        <Link
                            to="/carrito"
                            className="navbar-cart"
                        >
                            <span>
                                Carrito
                            </span>

                            <span className="cart-count">
                                {cantidadTotal}
                            </span>
                        </Link>

                    </nav>

                    <div className="navbar-account">

                        {!usuario ? (
                            <>
                                <Link
                                    to="/login"
                                    className="login-link"
                                >
                                    Iniciar sesión
                                </Link>

                                <Link
                                    to="/registro"
                                    className="register-button"
                                >
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <div className="user-menu">

                                <span className="welcome-user">
                                    Hola, {usuario.nombre}
                                </span>

                                <button
                                    className="logout-button"
                                    onClick={cerrarSesion}
                                >
                                    Cerrar sesión
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </header>

            {/* HERO */}

            <main>

                <section className="hero-section">

                    <div className="hero-content">

                        <span className="hero-label">
                            BIENVENIDO A LUSTESHOP
                        </span>

                        <h1>
                            Encontrá lo que
                            <br />
                            <span>
                                estás buscando.
                            </span>
                        </h1>

                        <p>
                            Productos seleccionados,
                            excelente calidad y una
                            experiencia de compra simple.
                        </p>

                        <div className="hero-buttons">

                            <a
                                href="#productos"
                                className="primary-button"
                            >
                                Ver productos
                                <span>→</span>
                            </a>

                            {!usuario && (
                                <Link
                                    to="/registro"
                                    className="secondary-button"
                                >
                                    Crear una cuenta
                                </Link>
                            )}

                        </div>

                    </div>

                    <div className="hero-decoration">

                        <div className="hero-card">

                            <div className="hero-card-top">

                                <span>
                                    LUSTESHOP
                                </span>

                                <span>
                                    01
                                </span>

                            </div>

                            <div className="hero-card-circle">
                                L
                            </div>

                            <div className="hero-card-bottom">

                                <span>
                                    PRODUCTOS
                                </span>

                                <span>
                                    PREMIUM
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* BENEFICIOS */}

                <section className="benefits">

                    <div className="benefit">

                        <div className="benefit-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Compra segura
                            </strong>

                            <span>
                                Tus datos protegidos
                            </span>

                        </div>

                    </div>

                    <div className="benefit">

                        <div className="benefit-icon">
                            ↗
                        </div>

                        <div>

                            <strong>
                                Envío rápido
                            </strong>

                            <span>
                                Recibí tu compra rápidamente
                            </span>

                        </div>

                    </div>

                    <div className="benefit">

                        <div className="benefit-icon pink">
                            ★
                        </div>

                        <div>

                            <strong>
                                Calidad
                            </strong>

                            <span>
                                Productos seleccionados
                            </span>

                        </div>

                    </div>

                </section>

                {/* PRODUCTOS */}

                <section
                    id="productos"
                    className="products-section"
                >

                    <div className="products-header">

                        <div>

                            <span className="section-label">
                                COLECCIÓN
                            </span>

                            <h2>
                                Nuestros productos
                            </h2>

                        </div>

                        <span className="products-count">
                            {productos.length} productos
                        </span>

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {!error &&
                        productos.length === 0 && (
                            <div className="empty-products">
                                No hay productos disponibles.
                            </div>
                        )}

                    <div className="product-grid">

                        {productos.map((producto) => (

                            <article
                                key={producto.id}
                                className="product-card"
                            >

                                <div className="product-card-accent"></div>

                                <div className="product-content">

                                    <div className="product-number">
                                        #{String(
                                            producto.id
                                        ).padStart(2, "0")}
                                    </div>

                                    <h3>
                                        {producto.nombre}
                                    </h3>

                                    <p className="product-description">
                                        {producto.descripcion}
                                    </p>

                                    <div className="product-bottom">

                                        <div>

                                            <span className="price-label">
                                                PRECIO
                                            </span>

                                            <div className="product-price">

                                                $
                                                {Number(
                                                    producto.precio
                                                ).toLocaleString(
                                                    "es-AR",
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}

                                            </div>

                                        </div>

                                        <span
                                            className={
                                                producto.stock > 0
                                                    ? "stock available"
                                                    : "stock unavailable"
                                            }
                                        >
                                            {producto.stock > 0
                                                ? `${producto.stock} disponibles`
                                                : "Sin stock"}
                                        </span>

                                    </div>

                                    <button
                                        className="add-button"
                                        onClick={() =>
                                            agregarAlCarrito(
                                                producto
                                            )
                                        }
                                        disabled={
                                            producto.stock <= 0
                                        }
                                    >

                                        <span>
                                            {producto.stock > 0
                                                ? "Agregar al carrito"
                                                : "Sin stock"}
                                        </span>

                                        {producto.stock > 0 && (
                                            <span>
                                                +
                                            </span>
                                        )}

                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            </main>

            {/* FOOTER */}

            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-brand">

                        <Link
                            to="/"
                            className="logo"
                        >
                            <span className="logo-icon">
                                L
                            </span>

                            <span className="logo-text">
                                LusteShop
                            </span>
                        </Link>

                        <p>
                            Una nueva forma de comprar.
                        </p>

                    </div>

                    <div className="footer-links">

                        <Link to="/">
                            Inicio
                        </Link>

                        <Link to="/carrito">
                            Carrito
                        </Link>

                        {usuario && (
                            <Link to="/mis-pedidos">
                                Mis compras
                            </Link>
                        )}

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;
