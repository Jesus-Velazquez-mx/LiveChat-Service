import express from 'express';
import cors from 'cors';
import db from '../database/database.js';
import router from '../routes/routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

/* Para que sea un servidor en tiempo real*/
import { createServer } from 'http';
import { Server } from 'socket.io';

/* Para decifrar los tokens y sacar el id y el email */
import jwt from 'jsonwebtoken';

/* Crear instancia de la aplicación Express */
const app = express();
const PORT = 3000;

/* Envolvemos Express en un servidor HTTP */
const httpServer = createServer(app);

/* Inicializamos Socket.io sobre ese servidor HTTP */
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Permite conexiones desde el frontend
        methods: ["GET", "POST"]
    }
});

/* __filename obtiene la ruta del archivo actual */
const __filename = fileURLToPath(import.meta.url);
/* __dirname corta el nombre del archivo, dejando nomás la ubicación de la carpeta en el OS */
const __dirname = path.dirname(__filename);

/* app.use([ruta_opcional], middleware_o_router) */
/* Un middleware es una función que se ejecuta antes de llegar a la ruta */

/* Permitir solicitudes desde cualquier origen (CORS) */
app.use(cors());
/* Retornar JSON en las respuestas */
app.use(express.json());
/* Usar las rutas definidas en router */
app.use('/api', router);

/* Buscamos el dist */
const distPath = path.join(__dirname, '../../dist');

/* Decimos a express que sirva en la carpeta 'dist', que es donde vivirá el React comiplado*/
app.use(express.static(distPath));

/* Cualquier ruta que no esté aquí se la mandamos a React */
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

/* Socket.io */
/* Primero deciframos el token */
/* io.use(socket, next) sirve para registrar un middleware */
/* socket es la conexión o tunel y tiene el .handshake que nos ayuda a sacar el token */
/* next() simplemente nos dice que ya está listo para usar con el .on */
io.use((socket, next) => {
    /* Recibimos el token que nos mandó React con .handshake.propiedad.valor*/
    const token = socket.handshake.auth.token;

    /* Si no hay nada, lanzamos el error */
    if (!token) {
        return next(new Error("Acceso denegado: No hay token"));
    }

    try {
        /* Hacemos lo inverso, ahora sacamos el payload con .verify */
        /* payload nos dará un objeto como el que creamos en el usuariosController */
        const payload = jwt.verify(token, 'Mi_Clave_Secreta_Ultra_Segura_LiveChat_2026');

        /* Ahora, le asignamos al socket la información del usuario */
        socket.usuario = payload;
        /* Le damos permiso de pasar al evento 'connection' */
        next();

    } catch (error) {
        console.error("Token inválido o expirado:", error.message);
        return next(new Error("Acceso denegado: Token inválido"));
    }
});

/* socket.on(nombreDelEvento, callback) */
/*.on('connection') es como la puerta de entrada. Se dispara cada vez que alguien abre el socket. */
/* Adentro de esta función debe de ir el .on('disconect')*/
io.on('connection', (socket) => {
    /* Cambiamos el estado del usuario a enLinea = 1*/
    const sqlConectar = 'UPDATE usuarios SET enLinea = 1 WHERE id = ?';
    db.run(sqlConectar, [socket.usuario.id], (err) => {
        if (err) {
            console.error('Error al poner al usuario en línea:', err.message);
        } else {
            console.log(`${socket.usuario.email} se ha conectado.`);
            /* socket.broadcast.emit manda un evento y el objeto a todos los sockets conectados */
            socket.broadcast.emit('usuario_estado_cambiado', { email: socket.usuario.email, enLinea: 1 });
        }
    });

    /* Escuchamos un evento personalizado que llamaremos 'enviar_mensaje' */
    /* socket.emit(nombreDelEvento, callback) */
    socket.on('enviar_mensaje', (datosDelMensaje) => {
        console.log('Mensaje recibido en el servidor:', datosDelMensaje);
        io.emit('recibir_mensaje', datosDelMensaje);
    });

    /* Se dispara cuando un usuario se desconecta */
    socket.on('disconnect', () => {
        /* Cuando el usuario se desconete, se cambia su estado de enLinea a = 0*/
        const sqlDesconectar = 'UPDATE usuarios SET enLinea = 0 WHERE id = ?';
        db.run(sqlDesconectar, [socket.usuario.id], (err) => {
            if (err) {
                console.error('Error al desconectar al usuario en SQLite:', err.message);
            } else {
                console.log(`${socket.usuario.email} se ha desconectado.`);
                socket.broadcast.emit('usuario_estado_cambiado', { email: socket.usuario.email, enLinea: 0 });
            }
        });
    });
});

/* Si usamos app.listen, Express encenderá, pero Socket.io se quedará apagado. */
httpServer.listen(PORT, () => {
    console.log(`Servidor LiveChat escuchando en el puerto ${PORT}`);
});

