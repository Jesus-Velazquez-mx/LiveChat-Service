import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/HomeContainer.module.css';
import MenuBar from '../components/MenuBar';
import UserCardContainer from './UserCardContainer';
import axios from 'axios';
import ChatContainer from './ChatContainer';

/* Importamos el Outlet para poder renderizar vistas dentro de un div/contenedor y el useNavigate para navegar */
import { useNavigate, Outlet } from 'react-router-dom'

function HomeContainer() {
    /* Obtenemos el socket o la conexión y al usuario logueado */
    const { socket, logout, usuario } = useContext(AuthContext);
    /* Para navegar entre vistas */
    const navigate = useNavigate();

    /* Para obtener todos los usuarios */
    const [users, setUsers] = useState([]);
    useEffect(() => {
        /* Sacamos el token del navegador */
        const token = localStorage.getItem('token_livechat');
        /* Configuramos el header de axios */
        const config = {
            headers: {
                /* Este es el formato estándar de la industria (Bearer + token) */
                Authorization: `Bearer ${token}`
            }
        };

        /* Petición a la API */
        /* get(ruta).then(response => {}).catch(error => {})*/
        /* La ruta siempre lleva un / al principio para que se corte todo lo demás 
            y se haga de forma correcta*/
        axios.get('/api/usuarios', config)
            .then((response) => {
                setUsers(response.data);
                console.log('Se han cargado todos los usuarios correctamente: ', response.data)
            }).catch((error) => {
                console.log('No se han podido obtener todos los usuarios: ', error)
            })
    }, [])


    useEffect(() => {
        /* Si no hay socket o conexión no debería de pasar nada en el home */
        if (!socket) return;
        /* .emit.broadcast manda un objeto con los datos del usuario */
        /* Dicho objeto no se pone en una variable, sino que se pone como parámetro 
            en la función que va a usar el socket.on cuando escuche el evento con
            cualquier nombre
        */
        const manejarCambioDeEstado = (datos) => {
            if (datos.enLinea === 1) {
                toast.success(`${datos.email} is now online.`);
            } else {
                toast.info(`${datos.email} has gone offline.`);
            }
            /* Buscamos al usuario en nuestra lista y le actualizamos el estado */
            /* listaActual es el objeto que nos da React cuando usamos el set. Contiene los valores actuales del arreglo */
            setUsers((listaActual) =>
                listaActual.map((user) =>
                    user.email === datos.email ? { ...user, enLinea: datos.enLinea } : user
                )
            );
        };

        const manejarNuevoUsuario = (nuevoUsuario) => {
            console.log("¡El socket escuchó un nuevo registro!", nuevoUsuario);
            setUsers((listaActual) => [...listaActual, nuevoUsuario]);
        }

        /* socket.on está escuchando los .emit.broadcast del evento */
        /* socket.on('nombre_del_evento', funcion_a_ejecutar) */
        /* Cuando ocurra, vas a ejecutar la siguiente función */
        socket.on('usuario_estado_cambiado', manejarCambioDeEstado);
        socket.on('nuevo_usuario_registrado', manejarNuevoUsuario);

        return () => {
            socket.off('usuario_estado_cambiado', manejarCambioDeEstado);
            socket.off('nuevo_usuario_registrado', manejarNuevoUsuario);
        };
    }, [socket]); /* Esto cambia si la conexión (socket) cambia */

    /* Para obtener los usuarios que tiene conversaciones con nosotros y sus últimos mensajes */
    const [usersConMensajes, setUsersConMensajes] = useState([]);
    const obtenerChatsRecientes = () => {
        /* Sacamos el token del navegador */
        const token = localStorage.getItem('token_livechat');
        /* Configuramos el header de axios */
        const config = {
            headers: {
                /* Este es el formato estándar de la industria (Bearer + token) */
                Authorization: `Bearer ${token}`
            }
        };

        /* Petición a la API */
        /* get(ruta).then(response => {}).catch(error => {})*/
        /* La ruta siempre lleva un / al principio para que se corte todo lo demás 
            y se haga de forma correcta*/
        axios.get('/api/usuariosConMensajes', config)
            .then((response) => {
                setUsersConMensajes(response.data);
                console.log('Se han cargado todos los usuarios con mensajes correctamente: ', response.data);
            })
            .catch((error) => {
                console.log('No se han podido obtener todos los usuarios con mensajes: ', error);
            });
    };

    useEffect(() => {
        if (!socket) return;
        obtenerChatsRecientes();

        /* Para recibir las notificaciones de los mensajes en cualquier vista*/
        const manejarMensajeGlobal = (datosDelMensaje) => {
            const { email_remitente, remitente_id, contenido } = datosDelMensaje;
            if (email_remitente !== usuario.email) {
                /* toast.info acepta un segund parametro que es un objeto de configuración */
                toast.info(`New message from ${email_remitente}: ${contenido}`, {
                    /* onClick de la tarjeta*/
                    onClick: () => {
                        /* Construimos un objeto con los datos el mensaje */
                        const usuarioA_Abrir = {
                            id: remitente_id,
                            email: email_remitente
                        };
                        /* Llamamos al handleCardClick*/
                        handleCardClick(usuarioA_Abrir);
                    },
                    style: { cursor: 'pointer' }
                });
                obtenerChatsRecientes();
            }

        };
        socket.on('recibir_mensaje', manejarMensajeGlobal);

        return () => {
            socket.off('recibir_mensaje', manejarMensajeGlobal);
        };

    }, [socket]);

    const handleLogOut = (e) => {
        logout();
        navigate('/signin');
    }

    /* Para abrir el ChatContainer */
    const [activeChat, setActiveChat] = useState(false);
    const [currentChatUser, setCurrentChatUser] = useState({
        id: null,
        email: '',
        enLinea: 0
    });

    /* Cachamos el usuario que nos manda la tarjeta, y destructuramos su id */
    const handleCardClick = (user) => {
        setActiveChat(true);
        setCurrentChatUser(user);
    }

    const handleCloseClick = () => {
        setActiveChat(false);
    }

    return (
        <div className={styles.homeContainer}>
            <div className={styles.contenedorMenu}>
                <MenuBar handleLogOut={handleLogOut} />
            </div>
            <div className={styles.contenedorPrimario}>
                {/* En lugar de poner una vista, ponemos el Outlet, que contiene 
                todas las rutas y vistas definidas desde el App.jsx */}
                <Outlet context={{ users, handleCardClick, usersConMensajes }} />
                {/* Cada ruta tendra el arreglo de usuarios*/}
            </div>
            <div className={styles.contenedorSecundario}>
                {activeChat && <ChatContainer
                    currentChatUser={currentChatUser}
                    handleCloseClick={handleCloseClick}
                    recargarBandeja={obtenerChatsRecientes} />}
            </div>

        </div>
    );
}

export default HomeContainer;