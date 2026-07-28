# 📦 Sistema de Inventarios Multi-Tenant (SaaS)

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🏗️ Visión General y Contexto

**Inventarios** es un software como servicio (SaaS) multitenant de nivel empresarial diseñado para la administración operativa y financiera de múltiples organizaciones o espacios de trabajo. A diferencia de un CRUD genérico convencional, este sistema está construido bajo un enfoque de **arquitectura multi-tenant aislada mediante subdominios virtuales (slugs) de ruta**. Cada organización posee su propio entorno de gestión independiente y seguro.

El propósito principal del proyecto es brindar una interfaz de usuario fluida, estéticamente sobresaliente (diseño premium de cristal acrílico / *glassmorphic*) y de alto rendimiento operativo, manteniendo un aislamiento de datos estricto a través de la base de datos PostgreSQL en Supabase.

---

## 🎯 Objetivos de la Plataforma

1. **Garantizar el Aislamiento de Datos**: Proteger de forma inequívoca la información confidencial de inventarios, gastos y colaboradores de cada empresa a través de políticas avanzadas en la base de datos.
2. **Brindar una Experiencia de Usuario Premium**: Wowificar al usuario a primera vista mediante animaciones dinámicas de transición (`ViewTransitions`), esquemas cromáticos HSL adaptables, oscuros y consistentes, y micro-interacciones.
3. **Maximizar el Rendimiento y la Eficiencia**: Utilizar renderizado del lado del servidor (SSR) de alto desempeño con Astro e hidratación parcial selectiva de componentes React.
4. **Simplificar el Escalamiento Colaborativo**: Proveer un sistema robusto de invitaciones e incorporación de colaboradores asignando roles específicos (RBAC).

---

## 🛠️ Stack Tecnológico

El proyecto está desarrollado utilizando herramientas modernas y optimizadas de desarrollo web:

* **Core Framework**: [Astro v5 (SSR)](https://astro.build/) - Manejo de rutas del servidor, compilación optimizada y layouts unificados de alta velocidad.
* **Componentes Interactivos**: [React v19](https://reactjs.org/) - Utilizado para las interfaces complejas que requieren alta interactividad y modales interactivos en tiempo real (por ejemplo, CRUD de colaboradores, formularios dinámicos y selectores reactivos).
* **Base de Datos y Autenticación**: [Supabase](https://supabase.com/) - PostgreSQL relacional, políticas RLS, triggers inteligentes de base de datos y autenticación de usuarios por tokens de sesión.
* **Estilos y Componentes de Diseño**: [Tailwind CSS v4](https://tailwindcss.com/) y componentes base adaptados de [Shadcn/UI](https://ui.shadcn.com/) - Diseño atómico robusto, variables HSL globales y adaptabilidad premium.
* **Gestor de Paquetes**: [pnpm](https://pnpm.io/) - Gestión ultra rápida de dependencias y soporte para arquitecturas monorepo (*workspaces*).

---

## 📁 Estructura del Proyecto

El código está estructurado bajo principios de arquitectura limpia y organización en base al dominio y funcionalidad (*Screaming Architecture*):

```text
inventarios/
├── src/
│   ├── actions/          # Astro Actions (Controladores tipados de lógica de servidor con Zod)
│   │   └── index.ts      # Definición de Actions (createCompany, createMember, etc.)
│   ├── components/       # Componentes de UI reactivos y maquetación
│   │   ├── ui/           # Átomos y piezas Shadcn (Botones, Inputs, Selectores, Dropdowns)
│   │   ├── members-list.tsx # Listado premium e interactivo de colaboradores en React
│   │   └── page-header.astro # Cabecera premium parametrizable para vistas operativas
│   ├── hooks/            # Hooks personalizados para estado y servicios
│   ├── layouts/          # Plantillas de maquetación (AppLayout.astro con sidebar fluida)
│   ├── lib/              # Utilidades centrales y factories (Conexión segura a Supabase)
│   │   └── supabase.ts   # Configuración de cliente Supabase y prevención de session leaks
│   ├── middleware.ts     # Guardián y middleware de autenticación de Astro
│   ├── styles/           # Archivos CSS globales y tokens de diseño v4
│   │   └── global.css    # Definición de variables HSL y clases de animación
│   └── pages/            # Sistema de enrutamiento físico (Routing)
│       ├── index.astro   # Página de inicio / Public Landing
│       ├── signin.astro  # Autenticación: Inicio de sesión
│       ├── register.astro # Autenticación: Registro
│       ├── dashboard.astro # Dashboard GLOBAL del usuario (Workspace Switcher)
│       ├── create-company.astro # Creación guiada de empresa mediante Astro Actions
│       └── app/
│           └── [slug]/   # ENTORNO DE LA EMPRESA SELECCIONADA
│               ├── index.astro      # Panel de Control principal de la empresa (Analíticas)
│               ├── inventory.astro  # Módulo de Almacén e Inventario físico
│               ├── expenses.astro   # Módulo de Flujos Financieros y Gastos
│               ├── members.astro    # Módulo de Gestión de Colaboradores (CRUD React)
│               └── settings.astro   # Centro de Ajustes Organizacionales y Seguridad
├── README.md             # Documentación principal del proyecto
├── package.json          # Metadatos del proyecto y dependencias
├── pnpm-lock.yaml        # Historial de dependencias bloqueado y determinista
└── pnpm-workspace.yaml   # Configuración del espacio de trabajo multi-proyecto pnpm
```

---

## ⚙️ Metodología y Patrones de Diseño

El desarrollo del sistema está guiado por estrictos patrones de ingeniería de software para asegurar que el código sea modular, mantenible y robusto:

### 1. Multi-Tenancy mediante Enrutamiento Dinámico
El sistema utiliza el slug de la organización (`/app/[slug]/...`) como la clave de demarcación de contexto. Las páginas del servidor recuperan la empresa activa utilizando el parámetro `Astro.params.slug`, aislando automáticamente las consultas y asegurando que un usuario solo interactúe con datos de la empresa correspondiente.

### 2. Prevención de Fugas de Sesiones en SSR (Session Bleeding)
En arquitecturas de servidor tradicionales con Supabase, usar un único cliente global de Supabase puede provocar que la sesión de un usuario "sangre" e invada las peticiones concurrentes de otros usuarios. Para solucionar esto, implementamos el patrón **Request-Scoped Client Factory** mediante la función `getSupabase(cookies)`:
```typescript
// src/lib/supabase.ts
export async function getSupabase(cookies: any) {
    const client = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: false, // Evita persistir y mezclar sesiones a nivel de servidor
                autoRefreshToken: false,
            },
        }
    );
    // Hidrata la sesión de forma aislada para la petición actual
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;
    if (accessToken && refreshToken) {
        await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    }
    return client;
}
```

### 3. Astro Actions (API Segura y Tipada)
Migramos la lógica de escritura a **Astro Actions** en `src/actions/index.ts`. Esto reemplaza los endpoints de API crudos (`/api/create-member`) por funciones de servidor 100% tipadas con validación integrada mediante esquemas **Zod** y manejo nativo de errores que se inyectan directamente en formularios HTML o llamadas React:
```typescript
// Ejemplo de Astro Action de Servidor
createCompany: defineAction({
    accept: 'form',
    input: z.object({
        nombre: z.string().min(3),
        email_contacto: z.string().email(),
        telefono: z.string().min(5),
    }),
    handler: async (input, context) => {
        const supabaseClient = await getSupabase(context.cookies);
        // Lógica de negocio segura...
        const slug = input.nombre.toLowerCase().replace(/\s+/g, '-');
        await supabaseClient.from("empresas").insert([{ ...input, slug }]);
        return { success: true, slug };
    }
})
```

### 4. Arquitectura de Diseño Atómico e Islas de Hidratación Selectiva
* **Layouts y Plantillas (`Astro`)**: Renderizados estáticamente en el servidor con transiciones de vista instantáneas.
* **Componentes de Contenido (`Astro`)**: Para interfaces que muestran información estática o datos directos de la BD, disminuyendo el JavaScript enviado al cliente.
* **Componentes Interactivos (`React`)**: Los paneles dinámicos (como la edición de roles, modales emergentes y avisos reactivos de eliminación) se encapsulan como "islas" React y se hidratan selectivamente usando la directiva `client:load` para optimizar el rendimiento de la aplicación.

---

## 🌐 Conexión a Base de Datos y Seguridad (RLS)

El corazón de la seguridad y el aislamiento multi-tenant reside en la capa de datos en **PostgreSQL (Supabase)**. Implementamos una arquitectura RLS (*Row Level Security*) robusta libre de recursividad para proteger las tablas clave de la aplicación:

### Relaciones del Modelo de Base de Datos
* **`profiles`**: Tabla de perfiles de usuario ligada directamente a la autenticación de Supabase (`auth.users`).
* **`empresas`**: Registro maestro de cada tenant. Cada empresa tiene un `dueño_id` único.
* **`miembros_empresa`**: Tabla pivote de membresía que asocia usuarios (`user_id`) con empresas (`empresa_id`) y les asigna un rol jerárquico (`owner`, `admin`, `contador`, `ayudante`).
* **`productos` y `gastos`**: Entidades operacionales dependientes de una empresa mediante `empresa_id`.

### Reglas RLS Libres de Recursión
Para prevenir errores de recursividad infinita (donde una política para evaluar miembros consulta la misma tabla de miembros de forma cíclica), encapsulamos las lecturas de verificación de roles en funciones con privilegios del sistema (`SECURITY DEFINER`):

```sql
-- Función de base de datos para obtener el rol del usuario de manera segura y eficiente
CREATE OR REPLACE FUNCTION public.obtener_rol_en_empresa(emp_id UUID, usr_id UUID)
RETURNS VARCHAR AS $$
BEGIN
    RETURN (
        SELECT rol 
        FROM public.miembros_empresa 
        WHERE empresa_id = emp_id AND user_id = usr_id 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Esto permite definir políticas RLS limpias y de alto rendimiento como:
* **Políticas para Gastos/Productos**:
  ```sql
  -- Permitir lectura y escritura solo si el usuario es miembro activo de la empresa asociada
  CREATE POLICY "Miembros pueden acceder a datos" 
  ON public.productos
  FOR ALL
  USING ( obtener_rol_en_empresa(empresa_id, auth.uid()) IS NOT NULL );
  ```

---

## 🖥️ Módulos Actuales y Funcionalidades Premium

### 1. Panel Global (Workspace Switcher)
* **Archivo**: [`src/pages/dashboard.astro`](./src/pages/dashboard.astro)
* **Funcionalidad**: Da la bienvenida dinámica al usuario e inicializa el selector de empresas. Muestra todas las organizaciones a las que el usuario pertenece en tarjetas estilizadas de vidrio con efectos dinámicos de degradado de fondo (radial glow), resumiendo el total de miembros, productos e importes simulados de gastos por cada espacio de trabajo.
* **Detalle UX**: Incorpora el botón interactivo de acceso rápido "Entrar al Workspace" y la opción en cabecera para "Crear nueva empresa".

### 2. Panel Analítico de la Empresa (Dashboard de Empresa)
* **Archivo**: [`src/pages/app/[slug]/index.astro`](./src/pages/app/[slug]/index.astro)
* **Funcionalidad**: Reemplaza el anterior selector redundante de empresas para centrarse 100% en los indicadores y analíticas del tenant seleccionado:
  * **Tarjetas de Estadísticas Clave**:
    * *Inventario*: Muestra la cantidad total de artículos físicos, el valor total acumulado del almacén y una barra indicadora de capacidad.
    * *Gastos Mensuales*: Muestra los gastos del mes actual frente al presupuesto asignado y el porcentaje de consumo de la cuenta.
    * *Colaboradores*: Indica el personal activo dentro del tenant y burbujas de avatares interactivos con las iniciales de los usuarios.
  * **Gráfica de Egresos Premium**: Un gráfico responsivo de línea suavizada vectorizada (SVG Bezier curve) con rellenos de degradado (*gradient fill*) que ilustra la progresión mensual de los flujos de dinero.
  * **Distribución de Stock**: Gráficos de barras horizontales detallando la ocupación en almacén por categoría (Materia Prima, Producto Terminado y Empaque).
  * **Alertas y Actividad Reciente**: Un feed centralizado que monitorea eventos críticos de la organización (ej: alertas por stock bajo en un producto específico, registros exitosos de compras grandes y alertas por invitaciones de colaboradores recientes).

### 3. Gestión Integral de Miembros (Colaboradores)
* **Archivos**: [`members.astro`](./src/pages/app/[slug]/members.astro) y [`members-list.tsx`](./src/components/members-list.tsx)
* **Funcionalidad**: Consiste en una aplicación en tiempo real construida sobre React para la gestión del personal.
  * **Visual Premium**: Tarjetas de colaboradores con efecto de desenfoque de fondo (*backdrop-blur*), micro-escalado al pasar el cursor y avatares con tonalidades generadas según el correo del usuario.
  * **Acciones Integradas**: Menús de opciones Shadcn UI para editar roles y eliminar miembros mediante flujos destructivos seguros.
  * **Modales Reactivos**: Formularios integrados nativamente con Astro Actions que actualizan las vistas del usuario al instante, mostrando spinners y controlando que no se elimine al último *Owner* de la empresa.

### 4. Almacén de Inventarios
* **Archivo**: [`inventory.astro`](./src/pages/app/[slug]/inventory.astro)
* **Funcionalidad**: Ofrece un buscador optimizado por SKU/Nombre de artículo, filtrado por categorías de producto e indicadores interactivos de stock (Óptimo, Bajo Stock, Agotado).

### 5. Control de Gastos
* **Archivo**: [`expenses.astro`](./src/pages/app/[slug]/expenses.astro)
* **Funcionalidad**: Módulo de monitoreo financiero que detalla los egresos operativos de la organización a través de una tabla premium parametrizada y resúmenes de costos mensuales.

### 6. Ajustes de la Empresa
* **Archivo**: [`settings.astro`](./src/pages/app/[slug]/settings.astro)
* **Funcionalidad**: Permite modificar la información corporativa, correo, teléfono y horarios del tenant. Además, expone la "Zona de Peligro" (*Danger Zone*) para la eliminación definitiva de la organización por parte de sus propietarios.

---

## 🛠️ Modos de Uso e Instalación

Para configurar, instalar y desplegar el proyecto localmente, sigue estos sencillos pasos:

### 1. Clonar el repositorio e instalar dependencias
Asegúrate de contar con [Node.js](https://nodejs.org/) (versión 18 o superior) y [pnpm](https://pnpm.io/) instalados en tu computadora:
```bash
git clone https://github.com/JavierMNew/inventarios.git
cd inventarios
pnpm install
```

### 2. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y agrega tus claves de conexión a tu base de datos Supabase:
```env
SUPABASE_URL="https://tu-proyecto-supabase.supabase.co"
SUPABASE_ANON_KEY="tu-anon-key-de-supabase"
```

### 3. Ejecutar el Entorno de Desarrollo
Para arrancar el servidor de desarrollo de Astro con recarga rápida en tiempo real (*HMR*):
```bash
pnpm dev
```
Abre tu navegador en [http://localhost:4321](http://localhost:4321) para comenzar a explorar la aplicación.

### 4. Compilar para Producción
Para compilar y empaquetar el bundle optimizado para su despliegue en la nube (ej: Vercel):
```bash
pnpm build
```

### 5. Despliegue con Docker y Docker Compose (Contenedores)
El proyecto cuenta con configuración lista para desplegarse mediante contenedores Docker.

#### Opción A: Mediante Docker Compose (Recomendado)
Asegúrate de tener un archivo `.env` configurado con tus credenciales de Supabase y ejecuta:
```bash
docker compose up -d --build
```
La aplicación web estará disponible en [http://localhost:4321](http://localhost:4321). Para detener el contenedor:
```bash
docker compose down
```

#### Opción B: Mediante Docker CLI
1. Construir la imagen Docker:
```bash
docker build -t inventarios-web .
```
2. Ejecutar el contenedor pasando las variables de entorno:
```bash
docker run -d -p 4321:4321 --env-file .env --name inventarios-app inventarios-web
```

---


## 🧪 Esquema de Pruebas y Validación

La calidad, seguridad y consistencia de los tipos en la aplicación se validan de forma constante mediante procesos automatizados:

1. **Validación Estricta de Tipos de Astro y TypeScript**:
   Usamos la herramienta oficial de Astro para auditar y verificar que no existan inconsistencias de tipos a nivel de componentes o layouts:
   ```bash
   npx astro check
   ```
2. **Validación de Formularios con Zod**:
   Cada Action en el servidor evalúa las entradas de los usuarios en tiempo real, impidiendo que datos corruptos, correos inválidos o identificadores UUID alterados impacten en la base de datos relacional.
3. **Aislamiento de Sesiones**:
   Monitoreamos y mitigamos los riesgos de sesiones cruzadas mediante la inyección limpia del cliente Supabase request-scoped, simulando flujos concurrentes pesados de peticiones múltiples al servidor de desarrollo.

---

## 📈 Beneficios Esperados del Sistema

* **Cero Filtraciones de Información**: El aislamiento estricto por PostgreSQL RLS asegura que cada empresa sea un silo hermético.
* **Velocidad y Respuesta Instantánea**: El uso inteligente de islas de hidratación de Astro disminuye el peso del paquete de JavaScript en el cliente, permitiendo cargas ultra veloces de páginas y navegación instantánea.
* **Mantenibilidad y Escalabilidad**: Gracias al tipado estricto con TypeScript, validación de Zod y la separación por Astro Actions, agregar un nuevo módulo operacional (como facturas, compras o proveedores) toma muy poco esfuerzo y mantiene la consistencia total.
* **Diseño Profesional de Vanguardia**: El uso coherente del sistema de diseño (Shadcn UI + Tailwind v4 HSL) garantiza una estética uniforme de alto nivel en todas las pantallas.

---

## 📝 Conclusión

El **Sistema de Inventarios Multi-Tenant** representa la fusión idónea entre rendimiento web moderno, seguridad relacional de primer nivel e interfaces de usuario espectaculares. Al abandonar las arquitecturas de bases de datos compartidas inseguras y migrar hacia una plataforma guiada por políticas RLS robustas y Astro Actions eficientes, la plataforma se posiciona como una base sumamente sólida, lista para escalar, operar y adaptarse a cualquier sector comercial que exija el más alto estándar digital.
