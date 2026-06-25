import { Router } from 'express';
/* Controladores */
import usuariosController from '../controllers/usuariosController.js';
import mensajesController from '../controllers/mensajesController.js';
/* Middleware*/
import { verificarToken } from '../middlewares/validarToken.js';

/* Funciones */
const { obtenerUsuarios, obtenerUsuariosActivos, registrarUsuario, iniciarSesion } = usuariosController;
const { mostrarMensajes, mandarMensaje } = mensajesController;

/* Router de express */
const router = Router();

/* Rutas */
/* Usamos el router.accion('/ruta', funcion)*/
/* Usamos la función verificarToken para aquellas que ya menejen usuarios (tokens/gafetes) */
/* Usuarios */
router.get('/usuarios', verificarToken, obtenerUsuarios);
router.get('/usuarios/activos', verificarToken, obtenerUsuariosActivos);
router.post('/usuarios/registrar', registrarUsuario);
router.post('/usuarios/iniciarSesion', iniciarSesion);

/* Mensajes */
router.get('/mensajes', verificarToken, mostrarMensajes);
router.post('/mensajes', verificarToken, mandarMensaje);
export default router;