# Desplegar UPN Talent Lab desde Google AI Studio

El repositorio ya está configurado para que AI Studio lo reconozca al importarlo y lo pueda
desplegar a Cloud Run sin tocar nada. Esta guía son los pasos exactos.

---

## Antes de empezar

Necesitas un **proyecto de Google Cloud con facturación activada**. Cloud Run tiene una capa
gratuita amplia y una aplicación como esta, sin tráfico, normalmente no genera cobro, pero sin
cuenta de facturación el botón *Deploy* no llega a completar. Se activa en
[console.cloud.google.com/billing](https://console.cloud.google.com/billing).

No hace falta clave de API: la aplicación no usa Gemini ni ningún servicio externo.

---

## Pasos

1. Entra a **[ai.studio](https://ai.studio)** e inicia sesión con tu cuenta de Google.
2. Abre la pestaña **Build**.
3. En el cuadro donde se escribe el prompt, pulsa el botón **+** (abajo a la izquierda) y elige
   **Import from GitHub**.
4. Conecta tu cuenta de GitHub si es la primera vez, y selecciona el repositorio
   **`Darknow-web/Aplicativo-UPN-Talent-Lab`**.
   No tienes que elegir rama: la rama que contiene el código es la rama por defecto del repositorio.
5. Espera a que AI Studio analice e importe el proyecto.
6. Pulsa **Deploy** y elige **Cloud Run**. Selecciona tu proyecto de Google Cloud y la región
   (`southamerica-west1`, en Santiago, es la más cercana a Perú).
7. Al terminar te da una URL pública terminada en `.run.app`. Esa es la que abres en el celular
   y la que puedes compartir.

---

## Qué hace que esto funcione

| Archivo | Para qué sirve |
|---|---|
| `package.json` | Identifica el proyecto como una aplicación Node. Sin dependencias, así que no hay ningún `npm install` que pueda fallar. |
| `server.js` | Servidor HTTP con solo módulos nativos de Node. Escucha en `$PORT` y en `0.0.0.0`, que es exactamente lo que Cloud Run requiere. |
| `Dockerfile` | Hace la construcción determinista: no depende de que Google adivine bien el tipo de proyecto. |
| `.dockerignore` | Deja fuera de la imagen `.git`, workflows y herramientas. |
| `metadata.json` | Nombre y descripción de la aplicación. |

El servidor solo expone `index.html`, `404.html`, `metadata.json`, `assets/` y `dist/`. El resto del
repositorio (código del servidor, workflows, herramientas) devuelve 404 aunque alguien adivine la
ruta.

El enrutamiento de la aplicación es por *hash* (`#/reto/r3`), así que el navegador nunca le pide
esas rutas al servidor y no hace falta ninguna regla de reescritura.

---

## Probarlo antes, en tu máquina

Es exactamente lo mismo que correrá en Cloud Run:

```
npm start
```

Y abres `http://localhost:8080`. Para simular el puerto que asigna Cloud Run:

```
PORT=3333 npm start
```

---

## Si algo sale mal

**La vista previa dentro de AI Studio no muestra la aplicación.**
Puede pasar: esa vista previa está optimizada para React, Next.js y Python, y este proyecto es un
sitio estático servido por Node. No impide el despliegue. Pulsa *Deploy* igualmente y comprueba la
URL de Cloud Run, que es la que vale. Si quieres verla mientras tanto, tienes el archivo
`dist/upn-talent-lab.html`, que es la aplicación completa en un solo archivo y se abre con doble
clic.

**El despliegue falla mencionando facturación o permisos.**
Falta activar la facturación en el proyecto de Google Cloud, o tu cuenta no tiene el rol necesario.
Con el rol *Cloud Run Admin* y *Service Account User* alcanza.

**El despliegue termina pero la página sale en blanco.**
Abre la consola del navegador (F12). Si hay errores 404 de `assets/...`, algún archivo no llegó a
la imagen; revisa que las líneas `COPY` del `Dockerfile` incluyan `assets`.

**Quiero cambiar algo desde AI Studio y que vuelva a GitHub.**
AI Studio tiene sincronización en dos sentidos: puedes hacer *Commit and Push* de lo que edites ahí
a una rama del repositorio, y traer de vuelta cambios hechos fuera desde la pestaña *GitHub* en
Settings.

---

## Las otras formas de verlo siguen funcionando

Configurar el despliegue no cambió nada de la aplicación. Siguen disponibles:

- **Archivo único:** `dist/upn-talent-lab.html`, se abre con doble clic, sin conexión.
- **GitHub Pages:** ya está el workflow; solo falta activarlo en *Settings → Pages → Source: GitHub
  Actions*.
- **Local:** `npm start`, o abrir `index.html` directamente.
