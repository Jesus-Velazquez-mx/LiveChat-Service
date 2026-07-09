import { Router } from 'express';
/* Controladores */
import usuariosController from '../controllers/usuariosController.js';
import mensajesController from '../controllers/mensajesController.js';
/* Middleware*/
import { verificarToken } from '../middlewares/validarToken.js';

/* Funciones */
const { obtenerUsuarios, registrarUsuario, iniciarSesion } = usuariosController;
const { mostrarMensajes, mandarMensaje, obtenerUsuariosConMensajes } = mensajesController;

/* Router de express */
const router = Router();

/* Rutas */
/* Usamos el router.accion('/ruta', funcion)*/
/* Usamos la función verificarToken para aquellas que ya menejen usuarios (tokens/gafetes) */
/* Usuarios */
router.get('/usuarios', verificarToken, obtenerUsuarios);
router.post('/usuarios/registrar', registrarUsuario);
router.post('/usuarios/iniciarSesion', iniciarSesion);

/* Mensajes */
router.get('/mensajes', verificarToken, mostrarMensajes);
router.post('/mandarMensaje', verificarToken, mandarMensaje);
router.get('/usuariosConMensajes', verificarToken, obtenerUsuariosConMensajes)
export default router;