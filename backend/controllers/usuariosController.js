import db from '../database/database.js';
import { z } from 'zod';
/* Para la encriptación de las contraseñas */
import bcrypt from 'bcrypt';
/* Para el token JWT */
import jwt from 'jsonwebtoken';

const usuarioSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6).max(50)
});

const obtenerUsuarios = (req, res) => {
    /* db.all(sql (string), [param, ...], callback) */
    /* all es una funcion que devuelve todas las filas que coinciden con la consulta */
    const sqlObtenerUsuarios = 'SELECT * FROM usuarios';

    db.all(sqlObtenerUsuarios, (err, rows) => {
        if (err) {
            console.log("Error al listar a todos los usuarios", err.message);
            return res.status(500).json({ error: "Error al listar a todos los usuarios" })
        } else {
            res.json(rows);
        }
    });
}

const obtenerUsuariosActivos = (req, res) => {
    /* db.all(sql (string), [param, ...], callback) */
    /* all es una funcion que devuelve todas las filas que coinciden con la consulta */
    const sqlObtenerUsuariosActivos = 'SELECT * FROM usuarios WHERE enLinea = 1';

    db.all(sqlObtenerUsuariosActivos, (err, rows) => {
        if (err) {
            console.log("Error al listar a todos los usuarios", err.message);
            return res.status(500).json({ error: "Error al listar a todos los usuarios activos" })
        } else {
            res.json(rows);
        }
    });
}

/* Es async porque necesita esperar a que termine la encriptación antes de hacer el INSERT */
const registrarUsuario = async (req, res) => {
    /* safeParse es una funcion de zod que valida los datos desde el objeto */
    const resultadoZod = usuarioSchema.safeParse(req.body);

    if (!resultadoZod.success) {
        return res.status(400).json({ error: resultadoZod.error.flatten().fieldErrors });
    }

    /* resultadoZod es un objeto que tiene un campo "success" booleano y los datos validados estan en el campo "data" */
    const { email, password } = resultadoZod.data;

    try {
        /* Para la encriptación se usa el de bcrypt.hash(string, númeroDeRondas(int)) */
        /* "10" es el número de saltos (rondas de procesamiento). Es el estándar de la industria. */
        const passwordEncriptada = await bcrypt.hash(password, 10);

        const sqlRegistrarUsuario = 'INSERT INTO USUARIOS (email, password) VALUES (?, ?)'
        /* db.run(sql (string), [param, ...], callback) */
        /* run es una funcion que ejecuta una insercion, actualizacion o eliminacion */
        /* Usamos function(err) porque sqlite regresa lastID que se puede acceder a traves de this.lastID */
        db.run(sqlRegistrarUsuario, [email, passwordEncriptada], function (err) {
            if (err) {
                /* Si la restricción UNIQUE se rompe (si se intenta registrar un correo que ya existe)*/
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: "Este correo ya está registrado" });
                }
                console.log("Error al registrar al usuario", err.message)
                return res.status(500).json({ error: "Error al registrar al usuario" })
            } else {
                res.status(201).json({ id: this.lastID, email })
            }
        });
    } catch (error) {
        console.log("Error en la encriptación de la contraseña", error.message)
        return res.status(500).json({ error: "Error al registrar al usuario" })
    }
}

const iniciarSesion = async (req, res) => {
    /* safeParse es una funcion de zod que valida los datos desde el objeto */
    const resultadoZod = usuarioSchema.safeParse(req.body);

    if (!resultadoZod.success) {
        return res.status(400).json({ error: resultadoZod.error.flatten().fieldErrors });
    }

    /* resultadoZod es un objeto que tiene un campo "success" booleano y los datos validados estan en el campo "data" */
    const { email, password } = resultadoZod.data;

    const sqlIniciarSesion = 'SELECT * FROM USUARIOS WHERE email = ?'
    /* Usamos db.get porque nos interesa solo un registro */
    /* Ahora, en lugar de una row, nos dará un objeto que contenga los datos de usuario y su token JWT */
    db.get(sqlIniciarSesion, [email], async (err, usuario) => {
        /* Fallo del servidor */
        if (err) {
            console.error("Error al iniciar sesión ", err.message)
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        /* Si el usuario ingresado no existe */
        if (!usuario) {
            console.error("Intento de login con correo inexistente:", email);
            return res.status(401).json({ error: "Correo o Contraseña incorrectos" });
        }

        /* Si encuentra al usuario, ahora toca comparar la contraseña encriptada. Para esto se ocupa un try/catch */
        /* Comprar la contraseña en texto plano con el hash de la bd lleva tiempo. Por eso es una async y se usa await*/
        /* bycrypt.compare(textoPlano, hash) regresa un true o false */
        try {
            const passwordValida = await bcrypt.compare(password, usuario.password);

            /* Si la contraseña es incorrecta */
            if (!passwordValida) {
                console.error("Contraseña incorrecta para el correo:", email);
                return res.status(401).json({ error: "Correo o Contraseña incorrectos" });
            }

            /* Definimos un objeto payload, que es como una credencial que contiene los datos del usuario */
            const payload = {
                id: usuario.id,
                email: usuario.email
            };

            /* Definimos la firma, que garantiza que la "credencial" del payload sea original y no sea falsificada */
            const llaveSecreta = 'Mi_Clave_Secreta_Ultra_Segura_LiveChat_2026';

            /* Fabricamos el token. jwt.sign(credencial, firma). Combina el payload y la firma para crear un token único */
            const token = jwt.sign(payload, llaveSecreta, {
                expiresIn: '24h' // El gafete caduca en 1 día
            });

            /* Si las credenciales están bien, metemos el resultado en un JSON junto con el token */
            res.status(200).json({ mensaje: "Inicio de sesión exitoso", token: token, usuario: { id: usuario.id, email: usuario.email, enLinea: usuario.enLinea } })


        } catch (error) {
            console.error("Error al comparar contraseñas:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    })

}

export default { obtenerUsuarios, obtenerUsuariosActivos, registrarUsuario, iniciarSesion }