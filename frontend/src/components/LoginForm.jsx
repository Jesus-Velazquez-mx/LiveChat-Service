import React from 'react';
import styles from '../styles/LoginForm.module.css'
import MyButton from './MyButton'

function LoginForm({ user, onChange, onSubmit, onSignIn, onSignUp, isSignIn, goToSignIn, goToSignUp }) {
    return (
        <form
            className={styles.formulario}
            onSubmit={isSignIn ? onSignIn : onSignUp}>
            {/* Nombre de usuario */}
            <label className={styles.labelFormulario} htmlFor="usuario">{isSignIn ? 'Email' : 'Your email goes here'}</label>

            <input
                className={styles.inputFormulario}
                name='email'
                type='text'
                value={user.email ? user.email : ''}
                onChange={onChange}
                required
                maxLength={25}
            />

            {/* Contraseña */}
            <label className={styles.labelFormulario} htmlFor="contraseña">{isSignIn ? 'Password' : 'Your password goes here'}</label>

            <input
                className={styles.inputFormulario}
                name='password'
                type='password'
                value={user.password ? user.password : ''}
                onChange={onChange}
                required
                minLength={6}
                maxLength={50}
            />

            {/* Iniciar Sesión o Guardar Usuario */}
            <MyButton
                tipo="submit"
                color='#2563EB'
                texto={isSignIn ? 'Sign in' : 'Save'}
            />

            <label className={styles.labelCentrada}>or</label>

            {/* Registrarse o volver a Iniciar Sesión */}
            <MyButton
                onClick={isSignIn ? goToSignUp : goToSignIn}
                color='#7C3AED'
                texto={isSignIn ? 'Create an account' : 'Cancel'}
            />
        </form>
    );
}

export default LoginForm;