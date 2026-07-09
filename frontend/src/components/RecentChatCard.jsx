import React from 'react';
import styles from '../styles/RecentChatCard.module.css';

function RecentChatCard({ user, handleCardClick, isCurrentUser, isLastMessage }) {

    /* Función para formatear la fecha */
    const formatearFecha = (fechaSQL) => {
        if (!fechaSQL) return '';

        /* Forzar que JS vea la fecha en formato UTC */
        const fechaMensaje = new Date(`${fechaSQL}Z`);
        const fechaHoy = new Date();

        /* Comparamos si el mensaje es de hoy */
        const esHoy = fechaMensaje.getDate() === fechaHoy.getDate() &&
            fechaMensaje.getMonth() === fechaHoy.getMonth() &&
            fechaMensaje.getFullYear() === fechaHoy.getFullYear();

        if (esHoy) {
            /* Si es de hoy, mostramos solo la hora */
            return fechaMensaje.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        } else {
            /* Si es de otro día, mostramos la fecha corta */
            return fechaMensaje.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
        }
    };

    return (
        <div
            className={styles.recentChatCard}
            role="button"
            onClick={() => handleCardClick(user)}
        >
            {/* Contenedor superior para alinear el correo y la fecha */}
            <div className={styles.topRow}>
                <h1 className={styles.h1RecentChatCard}>{isCurrentUser ? 'You' : user.email}</h1>
                <span className={styles.h3RecentChatCard}>
                    {formatearFecha(user.fecha_ultimo_mensaje)}
                </span>
            </div>

            {/* El mensaje en la parte inferior */}
            <h2 className={styles.h2RecentChatCard}>{isLastMessage ? 'You: ' : ''}{user.contenido}</h2>
        </div>
    );
}

export default RecentChatCard;