# EVENTODOS

EVENTODOS es una aplicación web para explorar eventos y rifas, consultar sus detalles y gestionar boletos en comunidades escolares y locales. El proyecto busca ofrecer una herramienta accesible para que grupos de estudiantes y organizaciones locales puedan promover actividades para recaudar fondos o apoyar una buena causa.

La aplicación fue creada por alumnos de bachillerato para responder a las necesidades de sus comunidades. Actualmente es un prototipo frontend: utiliza información de ejemplo y almacenamiento local del navegador, y no procesa pagos reales ni sincroniza datos entre dispositivos.

## Funcionalidades

- Explorar eventos y consultar información como fecha, ubicación, organizador, categorías y opciones de boleto.
- Buscar y filtrar eventos por distintos criterios.
- Explorar rifas públicas y consultar sus premios y causas.
- Crear rifas como públicas o guardarlas como borradores en la aplicación.
- Consultar la actividad de compra y ver boletos digitales con código QR.
- Guardar eventos, rifas, compras, avisos y la selección de rol en `localStorage`.

Los datos guardados en `localStorage` solo están disponibles en el navegador y dispositivo donde se creó la información. Borrar los datos del sitio o usar otro dispositivo puede hacer que ya no estén disponibles.

## Tecnologías utilizadas

- **JavaScript (ES Modules)** y **JSX**
- **React 19** para la interfaz de usuario
- **Vite 8** para desarrollo y compilación
- **QRCode** para generar códigos QR en los boletos digitales
- **CSS** para los estilos
- **Oxlint** para análisis estático del código
- **GitHub Pages** y **GitHub Actions** para la publicación del sitio

## Requisitos

- [Node.js](https://nodejs.org/) 22
- npm, incluido con Node.js
- Git para clonar el repositorio

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/CristalL29/EVENTODOS.git
cd EVENTODOS
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor local de desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local, normalmente `http://localhost:5173/`. Abre esa dirección en el navegador. Los cambios realizados en el código se reflejan mientras el servidor está activo.

## Uso

### Probar la aplicación

1. Ejecuta `npm run dev` y abre la dirección local indicada por Vite.
2. Explora los eventos disponibles, utiliza la búsqueda y los filtros, y abre un evento para consultar sus detalles.
3. Revisa la sección de rifas para explorar las publicaciones disponibles.
4. Prueba las opciones de compra y consulta la actividad y los boletos digitales generados por la aplicación.
5. La información de prueba que se guarda se conserva en el almacenamiento local del navegador.

La interfaz permite probar flujos de eventos, rifas y boletos, pero no realiza cargos ni confirma pagos reales.

### Compilar y revisar la versión de producción

Genera los archivos optimizados:

```bash
npm run build
```

La compilación se guarda en `dist/`. Para verla localmente:

```bash
npm run preview
```

### Comprobar el código

```bash
npm run lint
```

### API

EVENTODOS no ofrece actualmente una API ni un servidor backend. Los ejemplos de eventos, rifas, compras y avisos se gestionan desde la interfaz y se guardan en el almacenamiento local del navegador.

## Publicación

El proyecto está configurado para GitHub Pages en la ruta `/EVENTODOS/`. El flujo de GitHub Actions compila la aplicación y publica el contenido de `dist/` al actualizar la rama `main`.

Sitio publicado: <https://cristall29.github.io/EVENTODOS/>

## Licencia

La licencia del proyecto está **pendiente de definición**. Por el momento, no se ha otorgado mediante este repositorio una licencia estándar para copiar, modificar o redistribuir el código. Antes de reutilizarlo, solicita autorización a sus autores. Cuando el equipo decida los términos de uso, deberá añadir la licencia correspondiente al repositorio.
