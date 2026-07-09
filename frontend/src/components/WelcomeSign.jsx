import React from 'react';
/* Importamos los estilos del módulo */
import styles from '../styles/WelcomeSign.module.css';

function WelcomeView() {
    return (
        <div className={styles.welcomeContainer}>

            {/* Tarjeta con el efecto Glass */}
            <div className={styles.glassCard}>
                <h1 className={styles.title}>Welcome to LiveChat! 👋</h1>
                <p className={styles.subtitle}>
                    Please select an option from the menu.
                </p>
            </div>

        </div>
    );
}

export default WelcomeView;