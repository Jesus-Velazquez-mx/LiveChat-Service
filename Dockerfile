# 1. Usamos Node 20 (versión ligera 'alpine') para asegurar compatibilidad con Vite
FROM node:20-alpine

# 2. Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de configuración de paquetes
COPY package*.json ./

# 4. Instalamos TODAS las dependencias (necesitamos las de React para compilar y las de Express para correr)
RUN npm install

# 5. Copiamos el resto de tu código (archivos de React, servidor de Express, etc.)
COPY . .

# 6. Compilamos el frontend de React (esto generará la carpeta 'dist')
RUN npm run build

# 7. Creamos la carpeta 'data' para alojar la base de datos SQLite de forma segura
RUN mkdir -p data

# 8. Exponemos el puerto por el que escuchará tu servidor Express (asumiendo que es el 3000)
EXPOSE 3000

# 9. Comando final para encender el servidor (cambia 'app.js' por 'server.js' o el nombre de tu archivo principal si es diferente)
CMD ["node", "src/server/server.js"]