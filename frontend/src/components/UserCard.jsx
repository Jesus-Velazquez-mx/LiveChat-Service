import React from 'react';
import styles from '../styles/UserCard.module.css';
/* Iciono de círculo para las tarjetas */
import { FiCircle } from 'react-icons/fi';

function UserCard({ user }) {
    return (
        <div
            className={styles.userCard}
            role="button"
        >
            <h1 className={styles.h1Card}>{user.email}</h1>
            <h2 className={styles.h2Card}>
                {/* Evaluamos el estado y cambiamos el color/relleno del ícono */}
                {user.enLinea === 1 ? (
                    <FiCircle size={14} fill="#2ecc71" color="#2ecc71" />
                ) : (
                    <FiCircle size={14} fill="#e74c3c" color="#e74c3c" />
                )}

                {/* span es para poner cosas en la misma línea. Contenedor invisible */}
                <span style={{ marginLeft: '8px' }}>
                    {user.enLinea === 1 ? 'Online' : 'Offline'}
                </span>
            </h2>
        </div>
    );
}

export default UserCard;