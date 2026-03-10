
Sistema de automatización para consulta y generación de certificados de seguridad social mediante formularios web.


# Contexto del Proyecto: API REST Node.js (ES6)

## 🛠 Stack Tecnológico
- **Runtime:** Node.js (Versión LTS)
- **Lenguaje:** JavaScript Puro (ES6+) - **No TypeScript**.
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB con Mongoose (ODM).
- **Formato de Módulos:** ESM (`import`/`export`).

## 📁 Estructura de Carpetas
- `/src/config`: Configuraciones de DB (mongoose.connect) y variables de entorno.
- `/src/models`: Esquemas de Mongoose.
- `/src/controllers`: Lógica de control de rutas.
- `/src/routes`: Definición de endpoints de Express.
- `/src/middlewares`: Funciones de paso (auth, errores, validación).
- `/src/utils`: Funciones de ayuda generales.

## 📜 Reglas de Código (Estilo ES6)
1. **Importaciones:** Usar siempre `import x from 'y'`. No usar `require`.
2. **Asincronía:** Preferir `async/await` sobre `.then()`. 
3. **Manejo de Errores:** En los controladores, envolver la lógica en bloques `try/catch` y pasar el error al middleware global mediante `next(error)`.
4. **Variables:** Usar `const` por defecto, `let` solo si es necesario. Nunca usar `var`.
5. **Funciones:** Preferir Arrow Functions para middlewares y utilidades.
6. para el nombrado de variables y constantes utiliza camelCase.

## 🗄️ Convenciones de Mongoose
- Los nombres de los modelos deben estar en Singular y PascalCase (ej: `User.js`).
- Siempre incluir `timestamps: true` en el esquema.
- Validar campos obligatorios con mensajes personalizados en el Schema.

## 🚀 Comandos Útiles
- Iniciar Dev: `npm run dev` (usa nodemon).
- Iniciar Producción: `npm start`.
- Tests: `npm test`.


## modelo de base de datos (es lo inicial se sugieres agregar otros campos lo propones antes de modificar )


  

  ℹ️  Estas 3 colecciones 

**Colección: supervisores**
Cuentas de acceso al dashboard. No hay registro público —

password
name
googleDriveConfig


**Colección: contratistas**
documentType
documentNumber
fullName
eps


**Colección: reportes**
contractorId
platform
platformData
status
errorReason
driveFileId
filePath
createdAt

 
  ## SECCIÓN 5 — CAMPOS POR PLATAFORMA  

Estos son los campos exactos que cada scraper debe llenar, extraídos directamente de las interfaces reales de cada plataforma.


**SOI**
https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do
CAMPOS:
No. de documento
EPS
Periodo de pago — Mes
Periodo de pago — Año
Acción objetivo

Tipo de captcha: Sin captcha visible — comportamiento humano suficiente


**Aportes en Línea — aportesenlinea.com**
https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx
CAMPOS:
Tipo de documento
Número de documento
Fecha de expedición del documento
EPS
Generar certificado desde — Año
Generar certificado desde — Mes
Generar certificado hasta — Año
Generar certificado hasta — Mes
Actualmente usted es
reCAPTCHA

Tipo de captcha: reCAPTCHA v2 (checkbox "No soy un robot")

**Asopagos — asopagos.com**
https://www.enlace-apb.com/interssi/.plus
Tipo de certificado
Tipo de identificación del cotizante
N° de identificación del cotizante
Año
Mes
Tipo de reporte
Captcha imagen
Tipo de captcha: Captcha de imagen con número
  ⚠️  Tiene captcha de imagen. Estrategia: usar tesseract.js para OCR o servicio externo

***Compensar-miplanilla**
Tipo de Documento
Número de Documento
Número de Planilla
Fecha de pago — Día
Fecha de pago — Mes
Fecha de pago — Año
Periodo de pago salud — Mes
Periodo de pago salud — Año
Valor total pagado de la planilla
Captcha numérico




 ## ACTORES Y REQUERIMIENTOS FUNCIONALES  

Actores del Sistema
Actor	Autenticación	Qué puede hacer
Contratista	Ninguna (público)	Accede al formulario, selecciona plataforma, envía sus datos de pago. No ve reportes de otros.
Supervisor	JWT (email + contraseña)	Inicia sesión, consulta estado de reportes en dashboard, cambia su contraseña. No puede crear supervisores ni editar reportes.


**RF-01 · Portal de Inicio (Home)**
●	Dos rutas únicas: "Enviar Planilla" (público) e "Ingreso para Supervisores" (privado).
●	No existe ningún otro punto de entrada visible.
  


**RF-02 · Módulo del Contratista — Formulario**
●	Paso 1: Selector de plataforma (SOI | Aportes en Línea | Asopagos | Compensar).
●	Paso 2: Campos dinámicos según la plataforma — ver Sección 5.
●	Al enviar: crea registro en contratistas (si no existe) y en reportes con status: pending.
●	El contratista recibe confirmación visual inmediata.
  ⚠️  El contratista nunca se registra ni inicia sesión. Formulario 100% público.
  


**RF-03 · Módulo del Supervisor — Auth y Dashboard**
●	Login: email + contraseña → JWT → acceso al dashboard.
●	Sin registro público. Supervisores pre-cargados via seed.js.
●	Cambio de contraseña: el supervisor actualiza solo la suya.
●	Dashboard: lista de reportes con estado, errorReason cuando aplica, filtros por mes y estado.
  🚫  Dashboard es solo lectura. No edita ni elimina registros.
 


**RF-04 · Módulo de Automatización — Scrapers**
●	Lee reportes con status: pending y ejecuta el scraper correspondiente.
●	Actualiza status a processing al iniciar, success o error al terminar.
●	Comportamiento humano en todos los scrapers: tipeo variable, movimientos no lineales, pausas.
●	Error de un contratista no detiene el proceso — se registra y continúa con el siguiente.
  


**RF-05 · Módulo Google Drive**
●	Solo se ejecuta si status = success.
●	Sube PDF a: [Año] / [Mes] / [nombre_apellido.pdf]
●	Crea carpetas si no existen. Guarda driveFileId y filePath en el reporte.
  🚫  Jerarquía Drive obligatoria. Nunca subir a la raíz.
  


 






# frontend

**1. Estructura básica del proyecto**
/src
  /assets
  /components
  /views
  /composables
  /store
  /router
  /services
  /layouts
  /styles
  /plugins
  /utils
  App.vue
  main.js
**2. Explicación de cada carpeta**
•	/assets: Aquí van tus recursos estáticos como imágenes, fuentes o archivos que no cambian dinámicamente. En algunos casos, puedes incluir estilos globales aquí.

•	/components: Todos tus componentes reutilizables que no dependen de una vista en particular. Organízalos por características o funcionalidades. Ejemplo:
/components
  /Buttons
	/Tables
	/Encabezados


•	/views: Componentes principales que son parte de las rutas. Cada vista corresponde a una página o pantalla de tu aplicación.
/views
  HomeView.vue
  AboutView.vue

•	/composables: Esta carpeta es muy útil para Composition API. Aquí van todos tus composables reutilizables, como funciones lógicas que pueden ser compartidas entre componentes.
/composables
  useAuth.js
  useFetch.js
•	/store: Aquí se maneja el estado global de tu aplicación, si estás utilizando una librería como Pinia o Vuex. Puedes organizar módulos para diferentes partes de tu estado.
/store
  General.js

•	/router: Contiene la configuración de las rutas de Vue Router. Si tienes una aplicación más grande, puedes dividir las rutas en módulos.
/router
  index.js
  authRoutes.js
  dashboardRoutes.js
•	/services: Aquí puedes colocar las funciones relacionadas con las peticiones a la API o lógica de comunicación con el backend. Cada servicio puede representar un recurso diferente.
/services
  authService.js
  userService.js
axios.get(url)
axios.post(url, {datos})
axios.put(url, params, {datos})
axios.put(url, params)

•	/layouts: Si tu aplicación tiene diferentes plantillas (layouts) para distintas secciones (por ejemplo, una para administración y otra para usuarios), puedes definirlos aquí.
/layouts
  MainLayout.vue
  AdminLayout.vue
•	/styles: Todos los estilos globales y archivos de configuración de CSS/SCSS.
/styles
  variables.scss
  main.scss
•	/plugins: Archivos donde registras plugins globales o configuraciones que serán usadas a lo largo de la app (como el registro de librerías externas).
/plugins
  axios.js
	axios.default.baseurl=etapaspracticas/api
	axios.default.baseurl = loacalhost:4500/api
	axios.headers= {“x-token”:token}
  quasar.js

•	/utils: Funciones o clases auxiliares que no pertenecen necesariamente a la lógica de negocio o a los componentes (como validaciones, formatos de fecha, etc.).
/utils
  formatDate.js
  validateEmail.js



#   a u t o m a t i z a c i o n - c e r t i f i c a d o s  
 