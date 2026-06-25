import sqlite from 'sqlite3';

/* Regresa la instancia de la base de datos y la abre. Si no está disponible, la crea */
/* new sqlite3.Database(filename [, mode] [, callback])*/
const db = new sqlite.Database('./data/LiveChat.sqlite', (err) => {
    if (err) {
        console.error('Error abriendo la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

/* serialize para ejecutar consultas en orden */
/* serialize([callback]) */
/* run(sql [, param, ...] [, callback]) */
db.serialize(() => {
    const sqlUsuario = `CREATE TABLE IF NOT EXISTS USUARIOS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL CHECK(email LIKE '%@%'),
    password TEXT NOT NULL,
    enLinea BOOLEAN NOT NULL DEFAULT 0)`;
    db.run(sqlUsuario, (err) => {
        if (err) {
            console.log("Se ha producido un error al crear la tabla USUARIOS:  " + err.message)
        } else {
            console.log("La tabla de USUARIOS está lista para usarse.")
        }
    })

    const sqlMensajes = `CREATE TABLE IF NOT EXISTS MENSAJES (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remitente_id INTEGER NOT NULL,
    destinatario_id INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remitente_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (destinatario_id) REFERENCES USUARIOS(id))`;
    db.run(sqlMensajes, (err) => {
        if (err) {
            console.log("Se ha producido un error al crear la tabla MENSAJES: " + err.message)
        } else {
            console.log("La tabla de MENSAJES está lista para usarse.")
        }
    })
})

export default db;