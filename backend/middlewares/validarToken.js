/* Un middleware es una función que interceta la petición del backend, la procesa, y la manda al backend*/
/* Importamos la librería jsonwebtoken */
import jwt from 'jsonwebtoken';

/* El parametro next abre la puerta al backend */
export const verificarToken = (req, res, next) => {
    /* Extraer el token. En el estándar, el frontend envía el token en la cabecera "Authorization" 
    con este formato: "Bearer eyJhbGciOiJIUzI1NiIsInR..." */

    const cabeceraAutorizacion = req.headers.authorization;

    /* Si no está presente o no comienza con "Bearer" */
    if (!cabeceraAutorizacion || !cabeceraAutorizacion.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Acceso denegado. No hay un token válido en la petición." });
    }

    /* Quitamos la palabra "Bearer " y nos quedamos solo con el token */
    const token = cabeceraAutorizacion.split(' ')[1];

    try {
        /* Comprobamos el token y su vigencia */
        const llaveSecreta = 'Mi_Clave_Secreta_Ultra_Segura_LiveChat_2026'; // Debe ser idéntica a la del login

        /* jwt.verify "desencripta" el payload si la firma coincide. Si caducó, explota y se va al catch. */
        const payloadDecodificado = jwt.verify(token, llaveSecreta);

        /* Cuando decodificamos el payload, obtenemos el id y el email del usuario, y luego, lo metemos al objeto
         req para la siguiente función*/
        req.usuarioLogueado = payloadDecodificado;

        /* Lo pasamos al backend */
        next();

    } catch (error) {
        console.error("Intento de acceso con token inválido/expirado:", error.message);
        return res.status(403).json({ error: "El token ha expirado o no es válido. Por favor, inicia sesión de nuevo." });
    }
};