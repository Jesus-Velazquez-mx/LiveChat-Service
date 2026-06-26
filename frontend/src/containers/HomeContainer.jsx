import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/HomeContainer.module.css';
import MenuBar from '../components/MenuBar';
import { useNavigate } from 'react-router-dom'

function HomeContainer() {
    /* Obtenemos el socket o la conexión */
    const { socket, logout } = useContext(AuthContext);
    /* Cuando renderizamos */
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
        };

        /* socket.on está escuchando los .emit.broadcast del evento */
        /* socket.on('nombre_del_evento', funcion_a_ejecutar) */
        /* Cuando ocurra, vas a ejecutar la siguiente función */
        socket.on('usuario_estado_cambiado', manejarCambioDeEstado);

        /* Si la el usuario cierra sesión, apagamos el escuchador */
        return () => {
            socket.off('usuario_estado_cambiado', manejarCambioDeEstado);
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
            <MenuBar handleLogOut={handleLogOut} />
            <h1>Home Testtt</h1>
            {/* Aquí luego pondremos tu lista de usuarios activos */}
        </div>
    );
}

export default HomeContainer;