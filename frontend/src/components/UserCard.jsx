import React from 'react';
import styles from '../styles/UserCard.module.css';
/* Iciono de círculo para las tarjetas */
import { FiCircle } from 'react-icons/fi';

function UserCard({ user, handleCardClick, isCurrentUser }) {
    return (
        /* Mandamos al user en el onClick */
        <div
            className={styles.userCard}
            role="button"
            onClick={() => handleCardClick(user)}
        >
            <h1 className={styles.h1Card}>{user.email}</h1>
            <h2 className={styles.h2Card}>
                {/* Evaluamos el estado y cambiamos el color/relleno del ícono */}
                {isCurrentUser ? (
                    /* Si eres el logueado eres tú, le ponemos un color diferente */
                    <FiCircle size={14} fill="#7C3AED" color="#7C3AED" />
                ) : user.enLinea === 1 ? (
                    <FiCircle size={14} fill="#2ecc71" color="#2ecc71" />
                ) : (
                    <FiCircle size={14} fill="#e74c3c" color="#e74c3c" />
                )}
                {/* span es para poner cosas en la misma línea. Contenedor invisible */}
                <span style={{ marginLeft: '8px' }}>
                    {isCurrentUser
                        ? 'Online (You)'
                        : user.enLinea === 1
                            ? 'Online'
                            : 'Offline'}
                </span>
            </h2>
        </div>
    );
}

export default UserCard;