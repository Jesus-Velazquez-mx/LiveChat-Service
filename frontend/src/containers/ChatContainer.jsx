import React, { useState, useEffect, useContext, useRef } from 'react';
import MyButton from '../components/MyButton';
import MessageBar from '../components/MessageBar'
import MessageBubble from '../components/MessageBubble'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/ChatContainer.module.css'
/* Para el icono de la flecha */
import { FiArrowLeft } from 'react-icons/fi';


function ChatContainer({ currentChatUser, handleCloseClick, recargarBandeja }) {
    /* Guardamos los mensajes del chat */
    const [mensajes, setMensajes] = useState([]);
    /* El backend ya sabe quién es el usuario con el token.
    Esto se usa solamente para el .map del frontend*/
    const { usuario } = useContext(AuthContext);
    /* Importamos el socket (conexión) para el useEffect */
    const { socket } = useContext(AuthContext);

    useEffect(() => {
        /* Si no hay idChat no hacemos nada */
        if (!currentChatUser) return;
        /* Sacamos el token del navegador */
        const token = localStorage.getItem('token_livechat');
        /* Configuramos el header de axios */
        const config = {
            /* Mandamos el destinatario_id en params para que lo cache el .query */
            params: { destinatario_id: currentChatUser.id },
            headers: {
                /* Este es el formato estándar de la industria (Bearer + token) */
                Authorization: `Bearer ${token}`
            }
        };

        /* Petición a la API */
        /* get(ruta).then(response => {}).catch(error => {})*/
        /* La ruta siempre lleva un / al principio para que se corte todo lo demás 
            y se haga de forma correcta*/
        axios.get('/api/mensajes', config).then((response) => {
            setMensajes(response.data);
            console.log('Se han cargado todos los mensajes correctamente: ', response.data)
        }).catch((error) => {
            console.log('No se han podido obtener todos los mensajes: ', error)
        })

    }, [currentChatUser.id])

    const [mensajeMandar, setMensajeMandar] = useState({
        contenido: ''
    })

    /* Es async porque hacemos llamada al backend */
    const handleSendMessage = async () => {
        /* Si el mensaje está vacío no hacemos nada */
        if (mensajeMandar.contenido.trim() === "") return;
        /* Armamos el paquete para la api */
        const paqueteParaLaApi = {
            contenido: mensajeMandar.contenido,
            destinatario_id: currentChatUser.id
        };

        const token = localStorage.getItem('token_livechat');
        /* Configuramos el header de axios */
        const config = {
            headers: {
                /* Este es el formato estándar de la industria (Bearer + token) */
                Authorization: `Bearer ${token}`
            }
        };
        try {
            /* axios.post(URL, BODY, CONFIG)*/
            await axios.post('/api/mandarMensaje', paqueteParaLaApi, config)
            /* Aquí le vamos a hacer el emit para que el otro usuario pueda leer */
            const mensajeEnTiempoReal = {
                ...paqueteParaLaApi,
                email_remitente: usuario.email,
                remitente_id: usuario.id
            };
            /* Mandamos el mensaje (evento) al socket */
            socket.emit('enviar_mensaje', mensajeEnTiempoReal);
            /* Lo agregamos a la lista de los mensajes */
            setMensajes((mensajesAnteriores) => [...mensajesAnteriores, mensajeEnTiempoReal]);
            /* Limpiamos el input */
            setMensajeMandar({ contenido: '' });
            console.log("Mensaje enviado exitosamente:", paqueteParaLaApi);
            setMensajeMandar({
                contenido: ''
            });
            recargarBandeja();

        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    }

    /* Para recibir los mensajes en tiempo real */
    useEffect(() => {
        /* Si no recibimos una conexión o socket, no hacemos nada*/
        if (!socket) return;

        const manejarMensajeRecibido = (datosDelMensaje) => {
            /* Si el mensaje es de nosotros mismos, no cachamos el evento para que no se duplique*/
            if (datosDelMensaje.email_remitente === usuario.email) return;
            /* Si el remitente_id no es el mismo que abrió la ventana, entonces no se actualiza*/
            if (datosDelMensaje.remitente_id !== currentChatUser.id) return;
            console.log('¡Mensaje nuevo recibido por WebSockets!', datosDelMensaje);
            /* Agregamos el nuevo mensaje al final del arreglo que ya teníamos.
               Usamos (prevMensajes) => para asegurarnos de no borrar el historial viejo */
            setMensajes((prevMensajes) => [...prevMensajes, datosDelMensaje]);
            /* Lanzamos la notificación*/
            /* Extraemos las variables directamente */
            const { email_remitente, contenido } = datosDelMensaje;
        };

        /* Escuchamos 'recibir_mensaje' que es lo que escupe el backend */
        socket.on('recibir_mensaje', manejarMensajeRecibido);

        return () => {
            socket.off('recibir_mensaje', manejarMensajeRecibido);
        };
    }, [socket]);


    /* Para manejar el input del mensaje */
    const handleInputChange = ({ target }) => {
        setMensajeMandar({
            ...mensajeMandar,
            [target.name]: target.value

        })
    }

    /* Para hacer un scroll cada vez que tengamos un nuevo mensaje */
    /* Creamos la referencia para nuestro "ancla" */
    const messagesEndRef = useRef(null);
    /* Función que hace scroll */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    /* Cada vez que hay un nuevo mensaje se llama a scrollToBottom */
    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);


    return (
        <div className={styles.chatContainer}>
            {/* Correo de la persona y el botón de salir del chat */}
            <div className={styles.chatHeader}>
                <button
                    onClick={handleCloseClick}
                    className={styles.backButton}
                    aria-label="Close chat"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h2 className={styles.chatTitle}>{currentChatUser.email}{currentChatUser.id === usuario.id ? ' (You)' : ''}</h2>
            </div>

            {/* Área de los mensajes */}
            <div className={styles.messagesArea}>
                {mensajes.map((mensaje, index) => (
                    <MessageBubble
                        /* Usamos index como respaldo por si un mensaje temporal no tiene id todavía */
                        key={mensaje.id || index}
                        mensaje={mensaje}
                        isCurrentUser={usuario.email === mensaje.email_remitente}
                    />
                ))}
                {/* Para hacer autoscroll*/}
                <div ref={messagesEndRef} />
            </div>

            {/* Barra para escrbir */}
            <div className={styles.inputArea}>
                <MessageBar
                    handleSendMessage={handleSendMessage}
                    handleInputChange={handleInputChange}
                    mensajeMandar={mensajeMandar}
                />
            </div>

        </div>
    );
}

export default ChatContainer;
