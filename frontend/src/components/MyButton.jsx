import React from 'react';
import styles from '../styles/MyButton.module.css';

function MyButton({ onClick, color, texto, tipo = "button" }) {
    return (
        <button
            className={styles.botonBase}
            type={tipo}
            onClick={onClick}
            style={{ backgroundColor: color }}>
            {texto}
        </button>
    );
}

export default MyButton;