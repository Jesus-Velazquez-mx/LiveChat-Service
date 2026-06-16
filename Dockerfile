FROM node:20-alpine

# 1. Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 2. Copiamos SOLO los archivos de configuración del backend
COPY backend/package*.json ./

# 3. Instalamos las dependencias de Node.js (Express, Socket.io, SQLite, etc.)
RUN npm install

# 4. Copiamos todo el código fuente de tu backend
COPY backend/ ./

# 5. Copiamos el frontend compilado (GitHub Actions lo descarga en frontend/dist)
# Lo metemos en una carpeta "public" para que Express lo pueda mostrar
COPY frontend/dist ./public

# 6. Exponemos el puerto en el que correrá tu API de Express
EXPOSE 3000

# 7. Comando para iniciar el servidor
CMD ["npm", "start"]