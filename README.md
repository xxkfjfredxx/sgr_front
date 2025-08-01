# 💻 SGR Frontend – Sistema de Gestión de Riesgos

Este proyecto es la interfaz de usuario del sistema de gestión de riesgos laborales, construido con **React + Tailwind CSS**.

---

## 🚀 Tecnologías

- ⚛️ React (Vite o CRA)
- 🎨 Tailwind CSS
- 🧠 React Hooks personalizados
- 🔐 JWT Login (con consumo de backend Django)
- 📦 axios para consumir API REST (legacy)
- 🗃️ Redux Toolkit y RTK Query para el nuevo manejo de estado global

---

## 📦 Manejo de estado

El proyecto ahora incluye un store global basado en **Redux Toolkit**. Los datos
como `empresaId` y la autenticación se almacenan en slices dentro de `src/store`.
Además, las peticiones a la API se gestionan a través de **RTK Query** en
`apiSlice.js`.

## 📁 Estructura del proyecto
