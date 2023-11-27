# Instalar NodeJS
FROM node:18 AS frontend

# ----------------- FRONTEND ------------------
# Establece el directorio de trabajo en el contenedor
WORKDIR /app/Frontend

# Copia los requisitos de tu proyecto en el contenedor
COPY . .

#instalar dependencias
RUN npm i --force && npm cache clean --force

#Copiar todo lo que esta en esta carpeta
COPY . .

#Crear la build de la aplicacion
RUN npm run build



