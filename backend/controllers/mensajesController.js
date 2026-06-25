import db from '../database/database.js';
import { z } from 'zod'

const mensajeSchema = z.object({
    destinatario_id: z.number(),
    contenido: z.string().trim().min(1, "El mensaje no puede estar vacío")
})

const mostrarMensajes = (req, res) => {
    /* Sacamos el id del remitente desde el req que viene del middleware */
    const remitente_id = req.usuarioLogueado.id;
    const sqlMostrarMensajes = 'SELECT * FROM MENSAJES WHERE remitente_id = ? OR destinatario_id = ? ORDER BY fecha_hora ASC'

    /* Devuelve error o los resultados de la consulta */
    db.all(sqlMostrarMensajes, [remitente_id, remitente_id], (err, rows) => {
        if (err) {
            console.error("Error al obtener los mensajes", err.message)
            return res.status(500).json({ error: "No se pudieron obtener los mensajes" })
        } else {
            res.status(200).json(rows);
        }
    })
}

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

export default { mostrarMensajes, mandarMensaje }
