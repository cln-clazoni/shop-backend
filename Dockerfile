# Usa la imagen oficial Puppeteer que trae Chromium
FROM ghcr.io/puppeteer/puppeteer:latest

# Trabajamos como root para evitar problemas de permisos
USER root

WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del proyecto
COPY . .

# Exponemos puerto
EXPOSE 8080

# Arranca tu servidor
CMD ["npm", "start"]
