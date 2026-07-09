import React from 'react';
import styles from '../styles/MessageBubble.module.css';

function MessageBubble({ mensaje, isCurrentUser }) {
    return (
        /* El contenedor nos ayuda a empujar la burbuja a la izquierda o a la derecha */
        <div className={`${styles.contenedorBubbles} ${isCurrentUser ? styles.contenedorLadoDerecho : styles.contenedorLadoIzquierdo}`}>

            {/* La burbuja  */}
            <div className={`${styles.bubble} ${isCurrentUser ? styles.mensajeMandado : styles.mensajeRecibido}`}>
                <p className={styles.text}>{mensaje.contenido}</p>
            </div>

        </div>
    );
}

export default MessageBubble;