import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/HomeContainer.module.css';
import MenuBar from '../components/MenuBar';
import UserCardContainer from './UserCardContainer';
import axios from 'axios';

/* Importamos el Outlet para poder renderizar vistas dentro de un div/contenedor 
    y el useNavigate para navegar */
import { useNavigate, Outlet } from 'react-router-dom'

function HomeContainer() {
    /* Obtenemos el socket o la conexión */
    const { socket, logout } = useContext(AuthContext);

    const [users, setUsers] = useState([]);

    /* Obtener los usuarios */
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
        axios.get('/api/usuarios', config).then((response) => {
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

    /* Para navegar entre vistas */
    const navigate = useNavigate();

    const handleLogOut = (e) => {
        logout();
        navigate('/signin');
    }

    return (
        <div className={styles.homeContainer}>
            <div className={styles.contenedorMenu}>
                <MenuBar handleLogOut={handleLogOut} />
            </div>
            <div className={styles.contenedorPrimario}>
                {/* En lugar de poner una vista, ponemos el Outlet, que contiene 
                todas las rutas y vistas definidas desde el App.jsx */}
                <Outlet context={{ users }} />
                {/* Cada ruta tendra el arreglo de usuarios*/}
            </div>
            <div className={styles.contenedorSecundario}>

            </div>

        </div>
    );
}

export default HomeContainer;