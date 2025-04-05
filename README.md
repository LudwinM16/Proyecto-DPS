# 🎓 Proyecto-DPS

![Logo UDB](imgs/logoudb.png)

**Materia:** Diseño y Programación de Software Multiplataforma — *DPS941 G01T*  
**Docente:** Ing. Alexander Alberto Sigüenza Campos

## 👥 Integrantes

- **Carlos Adalberto Campos Hernández** - CH222748  
- **José Valentín Corcios Segovia** - CS232913  
- **Ludwin Enrique Martínez Alfaro** - MA222763  
- **Fernando Samuel Quijada Arévalo** - QA190088  

---

## 🎥 Video de Presentación

> Mira la demostración del proyecto en el siguiente enlace:  
[![Video de Presentación](https://img.youtube.com/vi/sYNgu23d_5c/0.jpg)](https://youtu.be/sYNgu23d_5c)

---

## 🚀 Funcionalidades Principales

### 🔐 Inicio de Sesión

- Página principal de login donde el usuario ingresa sus credenciales.
- Validación de credenciales correctas o incorrectas.

**Capturas:**

![Imagen 1](imgs/imagen1.png)
![Imagen 2](imgs/imagen2.png)

---

### 🛠️ Panel de Administración

Accesible únicamente para administradores, permite:

- Agregar, editar y eliminar usuarios.
- Mantenimiento del sistema.
- Auditoría del sitio.
- Revisión y gestión de proyectos.

**Capturas:**

- Vista general  
  ![Imagen 3](imgs/imagen3.png)

- Auditoría del sistema  
  ![Imagen 4](imgs/imagen4.png)

- Gestión de proyectos y mantenimiento  
  ![Imagen 5](imgs/imagen5.png)

#### ✅ Validación en Creación de Proyectos

- Validación de fechas:  
  - La fecha de inicio no puede ser menor a la actual.  
  - La fecha de finalización no puede ser menor a la fecha de inicio.  

![Imagen 6](imgs/imagen6.png)  
![Imagen 7](imgs/imagen7.png)

---

### 👤 Página de Inicio de Usuarios

Los usuarios autenticados pueden:

- Visualizar tareas asignadas.
- Ver comentarios en tareas.
- Actualizar el progreso de las mismas.

**Capturas:**

![Imagen 8](imgs/imagen8.png)  
![Imagen 9](imgs/imagen9.png)  
![Imagen 10](imgs/imagen10.png)

---

## 📂 Estructura del Proyecto

El proyecto está desarrollado con **Next.js**, con una arquitectura modular clara entre páginas, componentes y API.

### 📄 Páginas Principales

#### `index.js` (Inicio)

- Controla la lógica de autenticación.
- Envía credenciales a `/api/auth/login`.
- Guarda el token en `localStorage` y redirige según el rol.
- Manejo de errores con mensajes personalizados.

#### `login.js` (Login)

- Validación de campos (correo y contraseña).
- Enfoque directo en la autenticación.

### ⚙️ Configuración Global

#### `_app.js`

- Importación de estilos globales y Bootstrap.
- Configuración de `React Query`.
- Implementación del `AuthProvider`.

#### `_document.js`

- Personalización del documento HTML base.
- Inclusión de metadatos para SEO.

---

## 🛡️ Panel de Administración (`/admin`)

#### `admin/auditoria.js`

- Muestra actividades del sistema paginadas.
- Exportación a Excel con `xlsx`.
- Filtros por fecha y tipo de actividad.

![Imagen 12](imgs/imagen12.png)

#### `admin/index.js`

- Página de inicio del panel.
- Estadísticas del sistema.
- Accesos rápidos a usuarios, proyectos y auditoría.

#### `admin/mantenimiento.js`

- Gestión de respaldos y restauración de base de datos.
- Descarga de respaldos en formato `.sql`.

---

## 🔌 API (`/api/`)

#### `api/auth/login.js`

- Validación de credenciales.
- Hasheo de contraseñas con `bcrypt`.
- Generación de token JWT para manejo de sesiones.

---

## 🧰 Tecnologías Utilizadas

- **Next.js** (framework principal)
- **JavaScript** (frontend y backend)
- **MySQL** (base de datos)
- **Vercel** (despliegue)
- **Axios** (peticiones HTTP)
- **bcrypt** y **jsonwebtoken** (autenticación)
- **React Query** (gestión de datos eficiente)
