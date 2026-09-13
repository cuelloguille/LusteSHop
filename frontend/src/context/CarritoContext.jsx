import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        const carritoGuardado = localStorage.getItem("carrito");

        return carritoGuardado
            ? JSON.parse(carritoGuardado)
            : [];
    });

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        setCarrito((carritoAnterior) => {
            const productoExistente = carritoAnterior.find(
                (item) => item.id === producto.id
            );

            if (productoExistente) {
                return carritoAnterior.map((item) =>
                    item.id === producto.id
                        ? {
                              ...item,
                              cantidad: Math.min(
                                  item.cantidad + 1,
                                  producto.stock
                              )
                          }
                        : item
                );
            }

            return [
                ...carritoAnterior,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    };

    const quitarDelCarrito = (id) => {
        setCarrito((carritoAnterior) =>
            carritoAnterior.filter((item) => item.id !== id)
        );
    };

    const cambiarCantidad = (id, cantidad) => {
        setCarrito((carritoAnterior) =>
            carritoAnterior.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          cantidad: Math.max(
                              1,
                              Math.min(cantidad, item.stock)
                          )
                      }
                    : item
            )
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    const precioTotal = carrito.reduce(
        (total, item) =>
            total + Number(item.precio) * item.cantidad,
        0
    );

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                quitarDelCarrito,
                cambiarCantidad,
                vaciarCarrito,
                cantidadTotal,
                precioTotal
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);