# Hospi-Desk - Sistema de Mesa de Servicios Hospitalario

**Autor:** Juan Miguel Ramirez Mancilla

Sistema completo de gestión de tickets para instituciones hospitalarias, implementado con arquitectura limpia y patrones de diseño modernos.

## Arquitectura del Proyecto

```
PROYECTO_HOSPI_DESK/
├── Back/                   # Backend - API REST
│   ├── src/               # Código fuente TypeScript
│   ├── prisma/            # Esquemas y migraciones de base de datos
│   ├── Dockerfile         # Imagen Docker del backend
│   └── package.json       # Dependencias del backend
├── Front/                 # Frontend - React SPA
│   ├── src/              # Código fuente TypeScript/React
│   ├── Dockerfile        # Imagen Docker del frontend
│   ├── nginx.conf        # Configuración Nginx
│   └── package.json      # Dependencias del frontend
└── docker-compose.yml    # Orquestación de servicios
```

## Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript 5.3
- **Framework:** Express.js 4.18
- **Base de Datos:** PostgreSQL 15
- **ORM:** Prisma 5.7
- **Autenticación:** JWT (jsonwebtoken)
- **Seguridad:** bcrypt, helmet, cors
- **Arquitectura:** Clean Architecture + DDD
- **Inyección de Dependencias:** TSyringe

### Frontend
- **Framework:** React 18
- **Lenguaje:** TypeScript 5.2
- **Build Tool:** Vite 5
- **Router:** React Router 6
- **HTTP Client:** Axios
- **Web Server:** Nginx (producción)

### Infraestructura
- **Containerización:** Docker
- **Orquestación:** Docker Compose
- **Base de Datos:** PostgreSQL con volúmenes persistentes

## Instalación Rápida

### Opción 1: Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd PROYECTO_HOSPI_DESK

# 2. Iniciar todos los servicios
docker-compose up -d

# 3. Ver logs
docker-compose logs -f

# 4. Acceder a la aplicación
# Frontend: http://localhost
# Backend API: http://localhost:3000
# Base de Datos: localhost:5432
```

### Opción 2: Desarrollo Local

#### Backend

```bash
cd Back

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Ejecutar migraciones de base de datos
npx prisma migrate dev

#Crear areas:
node create-areas.js

# Iniciar servidor de desarrollo
npm run dev
```

#### Frontend

```bash
cd Front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://hospi_user:hospi_password@localhost:5432/hospi_desk?schema=public
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| frontend | 80 | Aplicación web (Nginx) |
| api | 3000 | API REST (Node.js) |
| postgres | 5432 | Base de datos PostgreSQL |

## Funcionalidades Principales

### Gestión de Tickets
- Crear, editar y eliminar tickets
- Asignación de tickets a técnicos
- Actualización de estados (Abierto, En Progreso, Pendiente, Resuelto, Cerrado)
- Prioridades (Baja, Media, Alta, Crítica)
- Filtros y búsqueda avanzada
- Paginación de resultados

### Sistema de Comentarios
- Comentarios públicos y privados
- Historial completo de conversaciones
- Notificaciones de nuevos comentarios

### Gestión de Archivos
- Subir archivos adjuntos (max 10MB)
- Descargar archivos
- Eliminar adjuntos
- Soporte para múltiples tipos de archivos

### Administración
- Gestión de áreas
- Gestión de usuarios
- Configuración de SLAs
- Auditoría de acciones

### Autenticación y Seguridad
- Login/Registro con JWT
- Refresh tokens
- Roles de usuario (REQUESTER, AGENT, TECH, ADMIN)
- Control de acceso basado en roles (RBAC)
- Cifrado de contraseñas con bcrypt
- Protección contra ataques comunes (CORS, Rate Limiting)

## Roles y Permisos

### REQUESTER (Solicitante)
- Crear tickets propios
- Ver sus tickets
- Agregar comentarios
- Subir archivos

### AGENT (Agente)
- Todo lo de REQUESTER
- Ver todos los tickets
- Actualizar estado de tickets
- Comentarios internos

### TECH (Técnico)
- Todo lo de AGENT
- Resolver tickets asignados
- Asignar tickets

### ADMIN (Administrador)
- Acceso total al sistema
- Gestionar áreas
- Gestionar SLAs
- Configuración del sistema

## API Endpoints

### Autenticación
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/request-password-reset
POST   /api/v1/auth/reset-password
```

### Tickets
```
GET    /api/v1/tickets
GET    /api/v1/tickets/:id
POST   /api/v1/tickets
PATCH  /api/v1/tickets/:id/assign
PATCH  /api/v1/tickets/:id/status
```

### Comentarios
```
POST   /api/v1/comments
```

### Archivos
```
POST   /api/v1/attachments/upload/:ticketId
DELETE /api/v1/attachments/:id
GET    /api/v1/attachments/download
```

### Áreas
```
GET    /api/v1/areas
GET    /api/v1/areas/:id
POST   /api/v1/areas
PUT    /api/v1/areas/:id
DELETE /api/v1/areas/:id
```

### SLAs
```
GET    /api/v1/slas
POST   /api/v1/slas
PUT    /api/v1/slas/:id
DELETE /api/v1/slas/:id
```

### Auditoría
```
GET    /api/v1/audit/ticket/:ticketId
GET    /api/v1/audit/actor/:actorId
```

## Comandos Útiles

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f [service]

# Reconstruir imágenes
docker-compose build --no-cache

# Limpiar todo
docker-compose down -v
```

### Backend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio

# Tests
npm test
npm run test:coverage
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## Testing

### Backend
```bash
cd Back
npm test                 # Todos los tests
npm run test:unit        # Tests unitarios
npm run test:e2e         # Tests E2E
npm run test:coverage    # Cobertura
```

## Patrones de Diseño Implementados

### Backend
1. **Repository Pattern** - Abstracción de persistencia
2. **Strategy Pattern** - Cálculo de SLAs
3. **Domain Events** - Eventos de dominio
4. **Value Objects** - Email, Priority, Status
5. **Dependency Injection** - TSyringe
6. **CQRS** - Separación de comandos y consultas
7. **Middleware Pattern** - Auth, validación, errores
8. **Factory Pattern** - Creación de entidades
9. **RBAC** - Control de acceso
10. **Adapter Pattern** - Notificaciones
11. **Mapper Pattern** - DTOs ↔ Entidades
12. **Domain Services** - Lógica de negocio compartida

### Frontend
- **Context Pattern** - Gestión de estado global
- **HOC Pattern** - Protección de rutas
- **Custom Hooks** - Lógica reutilizable
- **Composition** - Componentes modulares

## Estructura de Datos

### Modelos Principales
- User (Usuario)
- Ticket (Ticket)
- Area (Área)
- Comment (Comentario)
- Attachment (Archivo adjunto)
- SLA (Acuerdo de nivel de servicio)
- AuditTrail (Registro de auditoría)
- KnowledgeArticle (Base de conocimiento)
- Workflow (Flujo de trabajo)

## Troubleshooting

### Error: Puerto ya en uso
```bash
# Liberar puerto 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Liberar puerto 80 (frontend)
lsof -ti:80 | xargs kill -9
```

### Error: Base de datos no conecta
```bash
# Verificar contenedor de PostgreSQL
docker-compose logs postgres

# Reiniciar servicio
docker-compose restart postgres
```

### Error: CORS
Verificar que `CORS_ORIGIN` en el backend incluya la URL del frontend.

## Documentación Adicional

- [Backend README](./Back/README.md)
- [Frontend README](./Front/README.md)
- [API Documentation](./Back/docs/API.md)



## Licencia

Este proyecto es parte de la materia java y types para la universidad Santo Tomas.

## Contacto

**Juan Miguel Ramirez Mancilla**


---



---

### ¿Problemas?
1. Asegúrate de tener PostgreSQL corriendo
2. Verifica que los puertos 3000 y 5173 estén libres
3. Revisa la consola para ver mensajes de error
4. Ejecuta `node test-all-endpoints.js` para diagnosticar
