import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import axios from 'axios';
/* Toast para las notificaciones */
import { toast } from 'react-toastify';
import styles from '../styles/LoginFormContainer.module.css'
/* Para el contexto del usuario logueado */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoginFormContainer({ isSignIn }) {
    const [user, setUser] = useState({
        email: '',
        password: '',
        enLinea: 0
    })

    /* Sacamos la función login de AuthContext */
    const { login, isAuth } = useContext(AuthContext);

    /* Para la navegación entre vistas */
    const navigate = useNavigate();

    /* Cada vez que renderiza, se fija si ya está autenticado. Si ya está, lo manda al home*/
    useEffect(() => {
        if (isAuth) {
            navigate('/home')
        }
    }, [isAuth, navigate])

    const handleInputChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value

        })
    }

    /* Todas las peticiones a una API deben de ser ayncronas. Cada llamada (.post, .put, ...) lleva un await */
    /* Esto evita que la pantalla se congele mientras ocurre la petición */
    /* axios.metodoHTTP(url, body)*/
    /* Usamos post porque estamos creando un token */
    const handleSignIn = async (e) => {
        /* Evitar que se recargue la página */
        e.preventDefault();
        try {
            /* Esto nos da un objeto de respuesta, donde las propiedades que definimos están el .data*/
            const usuarioActivo = await axios.post('api/usuarios/iniciarSesion', user)
            console.log('Inicio de sesión exitoso');
            toast.success('Your log in was successful.');
            /* Guardamos el token obtenido en la memoria del navegador */
            /* Para acceder a las propiedes, usamos el .data */
            localStorage.setItem('token_livechat', usuarioActivo.data.token);
            /* Llamamos a la función del contexto de AuthContext */
            login(usuarioActivo.data.token);
            navigate('/home')

        } catch (error) {
            console.log('No se ha podido iniciar sesión', error);
            toast.error('There was an error during your Log In');
        }

    }

    const handleSignUp = async (e) => {
        /* Evitar que se recargue la página */
        e.preventDefault();
        try {
            await axios.post('api/usuarios/registrar', user)
            console.log('Usuario registrado correctamente', user);
            toast.success('Your account has been created.');
            navigate('/signin')

        } catch (error) {
            console.log('Ha ocurrido un error al registrar al usuario', error)
            toast.error('There was an error during your registration.');
        }

    }


    const goToSignUp = (e) => {
        e.preventDefault();
        navigate('/signup');
        setUser({
            email: '',
            password: '',
            enLinea: 0
        });
    }

    const goToSignIn = (e) => {
        e.preventDefault();
        navigate('/signin');
        setUser({
            email: '',
            password: '',
            enLinea: 0
        });
    }


    return (
        <div className={styles.divFormulario}>
            <div className={styles.tituloFormulario}>
                <h1 >Welcome to LiveChat</h1>
                <p>{isSignIn ? 'Please enter your credentials' : 'Create your account'} </p>

            </div>
            <LoginForm
                user={user}
                onChange={handleInputChange}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                isSignIn={isSignIn}
                goToSignUp={goToSignUp}
                goToSignIn={goToSignIn}
            />

        </div>
    )
}


export default LoginFormContainer;