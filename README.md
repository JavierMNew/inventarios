# 📦 Inventarios Multi-Tenant System

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🏗️ Visión Arquitectónica

Este no es otro CRUD genérico. **Inventarios** está diseñado bajo un modelo **Multi-tenant (SaaS)** utilizando arquitectura de rutas dinámicas por *slug*. Cada empresa tiene su propio espacio de trabajo aislado, gestionado a través de una estructura de rutas jerárquica en `/app/[slug]`.

### Conceptos Clave:
- **Autenticación Centralizada**: Gestionada vía `middleware.ts` interceptando sesiones de Supabase para proteger rutas de dashboard y app.
- **Aislamiento de Datos**: La lógica de negocio depende del identificador de la empresa (slug) presente en la URL, asegurando que los usuarios solo operen dentro de su contexto.
- **Arquitectura Screaming**: La estructura del proyecto "grita" su función. No buscamos carpetas genéricas, buscamos módulos funcionales.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Astro](https://astro.build/) - Elegido por su rendimiento y su isla de componentes para hidratación selectiva.
- **UI Logic**: [React](https://reactjs.org/) - Para la interactividad compleja en formularios y dashboards.
- **Backend / DB**: [Supabase](https://supabase.com/) - Auth, PostgreSQL y Realtime logic.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) - Diseño atómico y consistente.

---

## 📁 Estructura del Proyecto

```text
src/
├── components/       # Componentes de UI y Lógica (Organizados por funcionalidad)
│   ├── ui/           # Átomos y Moléculas (Shadcn/UI)
│   └── ...           # Organismos (Forms, Sidebars, Switchers)
├── layouts/          # Plantillas base para Auth y Aplicación
├── lib/              # Utilidades compartidas y cliente de Supabase
├── pages/            # Sistema de rutas (Routing)
│   ├── api/          # Endpoints de servidor (Auth/Database logic)
│   ├── app/[slug]/   # Dashboard específico de la Empresa (Core Business)
│   └── ...           # Rutas públicas (Signin/Register)
└── middleware.ts     # Guardian de seguridad y gestión de sesiones
