import React from 'react';
import styles from '../styles/MenuBar.module.css'
/* Link es parte del react router, y sirve para navegar entre páginas cuando se le hace click */
import { Link } from 'react-router-dom';
/* Librería de iconos de react */
/* Cada uno de estos es un icono */
import { FiMessageSquare, FiUsers, FiActivity, FiHome, FiLogOut } from 'react-icons/fi';

function MenuBar({ handleLogOut }) {
    return (
        <nav className={styles.menuBarContainer}>
            {/* Home*/}
            <div className={styles.grupoSuperior}>
                <Link to="/home" className={styles.iconosMenu} title="Home">
                    <FiHome size={24} />
                </Link>

                {/* Chats*/}
                <Link to="/chats" className={styles.iconosMenu} title="My chats" >
                    <FiMessageSquare size={24} />
                </Link>

                {/* Solo usuarios conectados */}
                <Link to="/conectados" className={styles.iconosMenu} title="Online users">
                    <FiActivity size={24} />
                </Link>

                {/* Todos los usuarios*/}
                <Link to="/usuarios" className={styles.iconosMenu} title="All users">
                    <FiUsers size={24} />
                </Link>

            </div>

            {/* Botón para salir*/}
            <button className={`${styles.iconosMenu} ${styles.botonSalir}`} title="Log out" onClick={handleLogOut}>
                <FiLogOut size={24} />
            </button>
        </nav>
    )
}

export default MenuBar