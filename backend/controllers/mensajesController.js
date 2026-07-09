import db from '../database/database.js';
import { z } from 'zod'

const mensajeSchema = z.object({
    destinatario_id: z.number(),
    contenido: z.string().trim().min(1, "El mensaje no puede estar vacío")
})

const mostrarMensajes = (req, res) => {
    const remitente_id = req.usuarioLogueado.id;
    /* El query permite mandar parametros opcionales en un get (porque no tiene body) */
    const destinatario_id = req.query.destinatario_id;
    const sqlMostrarMensajes = `
        SELECT 
            r.email AS email_remitente, 
            d.email AS email_destinatario,
            m.id, 
            m.contenido, 
            m.fecha_hora 
        FROM mensajes m
        INNER JOIN usuarios r ON r.id = m.remitente_id
        INNER JOIN usuarios d ON d.id = m.destinatario_id 
        WHERE (m.remitente_id = ? AND m.destinatario_id = ?) 
           OR (m.remitente_id = ? AND m.destinatario_id = ?)
        ORDER BY m.fecha_hora ASC;
    `;

    db.all(
        sqlMostrarMensajes,
        [remitente_id, destinatario_id, destinatario_id, remitente_id],
        (err, rows) => {
            if (err) {
                console.error("Error al obtener los mensajes", err.message);
                return res.status(500).json({ error: "No se pudieron obtener los mensajes" });
            } else {
                res.status(200).json(rows);
            }
        }
    );
};

/* Para mandar un mensaje */
const mandarMensaje = (req, res) => {
    /* Sacamos el id del remitente desde el req que viene del middleware */
    const remitente_id = req.usuarioLogueado.id;
    /* safeParse es una funcion de zod que valida los datos desde el objeto */
    const resultadoZod = mensajeSchema.safeParse(req.body);

    if (!resultadoZod.success) {
        return res.status(400).json({ error: resultadoZod.error.flatten().fieldErrors });
    }

    /* resultadoZod es un objeto que tiene un campo "success" booleano y los datos validados estan en el campo "data" */
    const { destinatario_id, contenido } = resultadoZod.data;

    const sqlMandarMensaje = 'INSERT INTO MENSAJES (remitente_id, destinatario_id, contenido) VALUES (?, ?, ?)';

    db.run(sqlMandarMensaje, [remitente_id, destinatario_id, contenido], (err) => {
        if (err) {
            console.error("Error al guardar mensaje en BD:", err.message);
            return res.status(500).json({ error: "No se ha podido mandar el mensaje por un error del servidor " })
        } else {
            res.status(201).json({ mensaje: "Mensaje enviado correctamente" })
        }
    })

}

/* Para mostrar los usuarios que han mandado un mensaje */
const obtenerUsuariosConMensajes = (req, res) => {
    /* Sacamos el ID del usuario conectado desde el token */
    const mi_id = req.usuarioLogueado.id;
    const sqlUsuariosConMensajes = `
        SELECT 
            u.id, 
            u.email, 
            m.contenido, 
            m.fecha_hora AS fecha_ultimo_mensaje,
            m.remitente_id
        FROM usuarios u
        INNER JOIN mensajes m ON (
            /* Condición A: Ellos me enviaron a mí */
            (m.remitente_id = u.id AND m.destinatario_id = ?) 
            OR 
            /* Condición B: Yo les envié a ellos */
            (m.remitente_id = ? AND m.destinatario_id = u.id)
        )
        WHERE m.fecha_hora = (
            SELECT MAX(fecha_hora)
            FROM mensajes m2
            WHERE 
                (m2.remitente_id = u.id AND m2.destinatario_id = ?) 
                OR 
                (m2.remitente_id = ? AND m2.destinatario_id = u.id)
        )
        ORDER BY fecha_ultimo_mensaje DESC;
    `;

    /* Como pusimos 5 signos de interrogación (?) en el SQL, tenemos que mandar la variable 'mi_id' 5 veces en el arreglo. */
    db.all(sqlUsuariosConMensajes, [mi_id, mi_id, mi_id, mi_id], (err, rows) => {
        if (err) {
            console.error("Error al obtener los remitentes:", err.message);
            return res.status(500).json({ error: "No se pudieron obtener los usuarios" });
        } else {
            /* Devuelve la lista de usuarios filtrada y ordenada por la BD */
            res.status(200).json(rows);
        }
    });
};

export default { mostrarMensajes, mandarMensaje, obtenerUsuariosConMensajes }

