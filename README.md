# 💬 LiveChat Service

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![AWS Fargate](https://img.shields.io/badge/Deployed_on-AWS_Fargate-FF9900?logo=amazonaws)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

LiveChat es una aplicación de mensajería en tiempo real diseñada con una moderna interfaz *glassmorphism*. Construida con una arquitectura Full Stack y desplegada de forma automatizada (CI/CD) en la nube utilizando contenedores Serverless.

## 🚀 Características Principales

* **Mensajería en Tiempo Real:** Comunicación bidireccional instantánea soportada por Socket.io.
* **Salas Privadas y Seguridad:** Autenticación de WebSockets mediante JSON Web Tokens (JWT) para garantizar que los usuarios solo accedan a sus propios mensajes.
* **Diseño Glassmorphism:** Interfaz de usuario limpia, translúcida y moderna.
* **Arquitectura de un solo Contenedor:** El backend de Express sirve de manera estática el build de React, optimizando los recursos de despliegue.
* **Despliegue Serverless:** Alojado en Amazon Web Services (ECS Fargate) sin necesidad de administrar servidores físicos o instancias EC2.

---

## 🛠️ Stack Tecnológico

**Frontend:**
* React.js
* Socket.io-client

**Backend:**
* Node.js & Express
* Socket.io (Manejo de WebSockets con CORS configurado)
* JWT (JsonWebToken) para autenticación
* SQLite (Base de datos embebida)

**DevOps & Infraestructura:**
* **Docker & Docker Hub:** Contenerización de la aplicación.
* **GitHub Actions:** Pipeline de CI/CD para construcción y publicación de imágenes.
* **AWS ECS (Fargate):** Orquestación y ejecución de contenedores sin servidor.

---

## 🏗️ Arquitectura y Despliegue en AWS

Este proyecto utiliza un flujo de entrega continua (Continuous Delivery):
1. Al realizar un `push` a la rama principal, **GitHub Actions** compila el frontend (React) y empaqueta todo el proyecto en una imagen de **Docker**.
2. La imagen se publica automáticamente en **Docker Hub**.
3. **AWS ECS (Fargate)** descarga la última versión pública de la imagen.
4. El contenedor expone el puerto `3000` a través de un Security Group configurado con reglas TCP personalizadas.
5. El backend utiliza `process.cwd()` para localizar y servir dinámicamente la carpeta `/public` con los archivos compilados del frontend, independientemente del sistema de archivos interno de Linux del contenedor.
