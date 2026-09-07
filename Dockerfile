# Imagen para Cloud Run. La aplicación no tiene dependencias, así que no hay
# ningún `npm install`: la imagen se construye en segundos y no puede fallar
# por un paquete roto.
FROM node:22-alpine

WORKDIR /app

# Solo lo que se sirve en producción.
COPY package.json server.js ./
COPY index.html 404.html metadata.json ./
COPY assets ./assets

# El archivo único se genera aquí y no se copia del repositorio: así la imagen
# nunca queda con un empaquetado viejo, ni falla la construcción si dist/ no
# está presente.
COPY tools ./tools
RUN node tools/empaquetar.js

# Cloud Run inyecta PORT; 8080 es el valor por defecto que usa server.js.
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Ejecutar sin privilegios de root.
USER node

CMD ["node", "server.js"]
