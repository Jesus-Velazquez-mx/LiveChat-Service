import React, { createContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { toast } from 'react-toastify';

/* Usamos esta clase para mantener el estado global del token una vez que se ha iniciado sesión. */
/* De esta manera la app siempre sabe cuál es le user logueado*/

/* Creamos una Nube o contexto para saber qué usuario está logueado */
export const AuthContext = createContext();

function AuthProvider({ children }) {
    /* Buscamos si ya existe un token en la memoria del navegador al cargar la página */
    const tokenInicial = localStorage.getItem('token_livechat');

    /* El estado global que toda la app podrá leer */
    const [token, setToken] = useState(tokenInicial);

    /* Esta constante nos permite guardar la conexión y usarla en toda la pantalla */
    const [socket, setSocket] = useState(null);

    /* Cuando se renderice por primera vez, o cambie el token, pasará esto.*/
    useEffect(() => {
        /* Si hay un token activo, abrimos el túnel TCP global */
        if (token) {
            /* Abre el tunel de comunicación con el backend */
            /* io(URL, opciones)*/
            /* opciones es un objeto de opciones */
            /* auth es otro objeto, y dentro de él se puede poner el token del contexto */
            const nuevoSocket = io('http://localhost:3000', {
                auth: {
                    token: token
                }
            });

            /* Un socket es una instancia de la clase socket. */
            /* Es un objeto con propiedades y funciones */
            setSocket(nuevoSocket);

            /* nuevoSocket.on('nombre_evento', funcion) */
            nuevoSocket.on('connect', () => {
                console.log('Se ha abierto un nuevo tunel TCP con el id:', nuevoSocket.id);
            });

            /* Limpieza */
            return () => {
                nuevoSocket.disconnect();
            };
        } else {
            /* Si no hay token (cerró sesión), desconectamos el socket anterior si existía */
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [token]); /* Reacciona automáticamente al iniciar o cerrar sesión */

    /* Función centralizada para iniciar sesión */
    const login = (nuevoToken) => {
        localStorage.setItem('token_livechat', nuevoToken);
        setToken(nuevoToken);
    };

    /* Función centralizada para cerrar sesión */
    const logout = () => {
        localStorage.removeItem('token_livechat');
        setToken(null);
    };

    /* Empaquetamos todo lo que queremos compartir en un objeto */
    const valoresGlobales = {
        token,
        socket, /* Pasamos el socket para que sea accesible desde cualquier contenedor */
        isAuth: !!token, /* Se convierte en 'true' si hay token, o 'false' si es null */
        login,
        logout
    };

    return (
        /* Entregamos el paquete a todos los 'children' (componentes hijos) */
        <AuthContext.Provider value={valoresGlobales}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;