# Hospi-Desk Frontend

**Autor:** Juan Miguel Ramirez Mancilla

Sistema de Mesa de Servicios Hospitalario - Interfaz de Usuario

## Características

- **Autenticación**: Login y registro de usuarios con JWT
- **Dashboard**: Vista general de tickets con filtros y búsqueda
- **Gestión de Tickets**: Crear, ver y actualizar tickets
- **Comentarios**: Sistema de comentarios internos y externos
- **Adjuntos**: Subir y descargar archivos adjuntos
- **Gestión de Áreas**: Panel de administración para áreas (solo Admin)
- **Roles de Usuario**: REQUESTER, AGENT, TECH, ADMIN

## Tecnologías

- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

## Instalación

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Con Docker

Desde la raíz del proyecto:

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f frontend
```

La aplicación estará disponible en `http://localhost`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Layout.tsx    # Layout principal con navegación
│   └── PrivateRoute.tsx  # Protección de rutas
├── contexts/         # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación
├── pages/            # Páginas de la aplicación
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── TicketDetail.tsx
│   ├── NewTicket.tsx
│   └── Areas.tsx
├── services/         # Servicios y API
│   └── api.ts        # Cliente API con Axios
├── types/            # Tipos TypeScript
│   └── index.ts
├── App.tsx           # Componente principal con rutas
├── main.tsx          # Punto de entrada
└── index.css         # Estilos globales
```

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Rutas de la Aplicación

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal con lista de tickets
- `/tickets/new` - Crear nuevo ticket
- `/tickets/:id` - Ver detalles de un ticket
- `/areas` - Gestión de áreas (solo Admin)

## Funcionalidades por Rol

### REQUESTER (Solicitante)
- Crear tickets
- Ver sus propios tickets
- Agregar comentarios
- Subir archivos adjuntos

### AGENT (Agente)
- Todo lo de REQUESTER
- Ver todos los tickets
- Actualizar estado de tickets
- Agregar comentarios internos

### TECH (Técnico)
- Todo lo de AGENT
- Resolver tickets asignados

### ADMIN (Administrador)
- Todo lo de TECH
- Gestionar áreas
- Acceso completo al sistema

## Integración con Backend

El frontend consume la API REST del backend a través de Axios.

### Ejemplo de llamada API:

```typescript
import { apiService } from '@/services/api';

// Obtener tickets
const tickets = await apiService.getTickets({
  status: 'OPEN',
  priority: 'HIGH',
  page: 1,
  pageSize: 10
});

// Crear ticket
const newTicket = await apiService.createTicket({
  title: 'Problema con sistema',
  description: 'Descripción detallada',
  priority: 'HIGH'
});
```

## Despliegue

### Build para Producción

```bash
npm run build
```

Los archivos estáticos se generarán en el directorio `dist/`

### Docker

El Dockerfile incluido usa una build multi-stage:
1. Stage de build: Compila la aplicación con Node.js
2. Stage de producción: Sirve los archivos estáticos con Nginx

## Desarrollo

### Agregar Nueva Página

1. Crear componente en `src/pages/`
2. Agregar ruta en `src/App.tsx`
3. Actualizar navegación en `src/components/Layout.tsx` si es necesario

### Agregar Nuevo Endpoint de API

1. Actualizar tipos en `src/types/index.ts`
2. Agregar método en `src/services/api.ts`
3. Usar en componentes

## Troubleshooting

### CORS Errors
Verifica que el backend tenga configurado correctamente CORS para aceptar peticiones del frontend.

### 404 en Producción
Asegúrate de que Nginx esté configurado para redirigir todas las rutas a `index.html` (ya configurado en `nginx.conf`).

### Token Expirado
El sistema redirige automáticamente a login cuando el token JWT expira.

