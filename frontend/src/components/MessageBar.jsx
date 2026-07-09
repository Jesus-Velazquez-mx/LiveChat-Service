import React from 'react';
import { FiSend } from 'react-icons/fi';
import styles from '../styles/MessageBar.module.css';

function MessageBar({ handleSendMessage, handleInputChange, mensajeMandar }) {
    return (
        <form
            className={styles.formMensaje}
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}
        >
            <input
                className={styles.inputMensaje}
                name='contenido'
                type='text'
                placeholder='Type something...'
                onChange={handleInputChange}
                value={mensajeMandar.contenido}
                autoComplete="off"
            />

            <button
                className={styles.sendButton}
                type='submit'
                aria-label='Type something'
            >
                <FiSend size={20} />
            </button>
        </form>
    );
}

export default MessageBar;