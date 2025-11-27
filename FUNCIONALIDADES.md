# HOSPI-DESK - Guía Completa de Funcionalidades

## Sistema de Mesa de Servicios para Hospital

---

## Tabla de Contenido

1. [Autenticación](#autenticación)
2. [Dashboard](#dashboard)
3. [Gestión de Tickets](#gestión-de-tickets)
4. [Gestión de Áreas](#gestión-de-áreas)
5. [Gestión de SLAs](#gestión-de-slas)
6. [Gestión de Usuarios](#gestión-de-usuarios)
7. [Perfil de Usuario](#perfil-de-usuario)

---

## Autenticación

### Funcionalidades Disponibles:

#### 1. **Registro de Usuario** (`/register`)
- Crear cuenta nueva
- Campos requeridos:
  - Nombre completo (mínimo 3 caracteres)
  - Email válido
  - Contraseña (mínimo 6 caracteres)
  - Rol (REQUESTER, AGENT, TECH, ADMIN)
- Campos opcionales:
  - Teléfono
  - Área
- **Estado**: FUNCIONANDO

#### 2. **Inicio de Sesión** (`/login`)
- Acceder con email y contraseña
- Genera tokens de acceso y refresh
- **Estado**: FUNCIONANDO

#### 3. **Recuperar Contraseña** (`/forgot-password`)
- Solicitar reset de contraseña por email
- **Estado**: FUNCIONANDO

#### 4. **Restablecer Contraseña** (`/reset-password`)
- Cambiar contraseña con token recibido
- **Estado**: FUNCIONANDO

---

## Dashboard

### Ubicación: `/dashboard`

### Funcionalidades:

#### 1. **Estadísticas Generales**
- Resumen de tickets por estado
- Contadores visuales
- Gráficos de prioridad
- **Estado**: FUNCIONANDO

#### 2. **Listado de Tickets**
- Ver todos los tickets
- Paginación (10 tickets por página)
- **Estado**: FUNCIONANDO

#### 3. **Búsqueda de Tickets**
- Buscar por texto
- Presiona Enter o botón "Buscar"
- **Estado**: FUNCIONANDO

#### 4. **Filtros**
- Por Estado: Abierto, En Progreso, Pendiente, Resuelto, Cerrado
- Por Prioridad: Baja, Media, Alta, Crítica
- **Estado**: FUNCIONANDO

#### 5. **Navegación Rápida**
- Click en cualquier ticket para ver detalles
- **Estado**: FUNCIONANDO

---

## Gestión de Tickets

### 1. **Crear Nuevo Ticket** (`/tickets/new`)

**Campos:**
- Título (requerido)
- Descripción (requerido)
- Prioridad: Baja, Media, Alta, Crítica
- Área (opcional)

**Acciones:**
- Click en "+ Nuevo Ticket" desde Dashboard
- Llenar formulario
- Enviar

**Estado**: FUNCIONANDO

---

### 2. **Ver Detalles de Ticket** (`/tickets/:id`)

**Información Mostrada:**
- Título y descripción completa
- Estado actual
- Prioridad
- Solicitante
- Técnico asignado (si aplica)
- Fecha de creación
- Historial de comentarios
- Archivos adjuntos

**Acciones Disponibles:**

#### A. **Cambiar Estado**
- Abierto → En Progreso → Pendiente → Resuelto → Cerrado
- Solo usuarios autorizados
- **Estado**: FUNCIONANDO

#### B. **Asignar Técnico**
- Seleccionar técnico del equipo
- Notificación automática
- **Estado**: FUNCIONANDO

#### C. **Agregar Comentarios**
- Comentarios públicos (visibles para solicitante)
- Comentarios internos (solo equipo técnico)
- **Estado**: FUNCIONANDO

#### D. **Subir Archivos**
- Capturas de pantalla
- Documentos
- Logs
- Límite: 10MB por archivo
- **Estado**: FUNCIONANDO

---

## Gestión de Áreas

### Ubicación: `/areas`

### Funcionalidades:

#### 1. **Listar Áreas**
- Ver todas las áreas del hospital
- Estado activo/inactivo
- **Estado**: FUNCIONANDO

#### 2. **Crear Área Nueva**
- Nombre
- Descripción
- Estado (activa/inactiva)
- **Estado**: FUNCIONANDO

#### 3. **Editar Área**
- Modificar nombre
- Modificar descripción
- Cambiar estado
- **Estado**: FUNCIONANDO

#### 4. **Desactivar Área**
- No elimina, solo desactiva
- Los tickets asociados se mantienen
- **Estado**: FUNCIONANDO

**Ejemplos de Áreas:**
- Urgencias
- Quirófano
- Laboratorio
- Farmacia
- Sistemas (TI)
- Recursos Humanos

---

## Gestión de SLAs (Service Level Agreements)

### Ubicación: `/slas`

### Funcionalidades:

#### 1. **Listar SLAs**
- Ver todos los acuerdos de nivel de servicio
- Por área y prioridad
- **Estado**: FUNCIONANDO

#### 2. **Crear SLA**
**Campos:**
- Área
- Prioridad
- Tiempo de respuesta (minutos)
- Tiempo de resolución (minutos)
- Estado (activo/inactivo)

**Estado**: FUNCIONANDO

#### 3. **Editar SLA**
- Modificar tiempos
- Cambiar estado
- **Estado**: FUNCIONANDO

#### 4. **Eliminar SLA**
- Desactivar acuerdo
- **Estado**: FUNCIONANDO

**Ejemplo de SLA:**
```
Área: Urgencias
Prioridad: CRÍTICA
Tiempo de Respuesta: 15 minutos
Tiempo de Resolución: 60 minutos
```

---

## Gestión de Usuarios

### Ubicación: `/users`

### Funcionalidades:

#### 1. **Listar Usuarios**
- Ver todos los usuarios del sistema
- Filtrar por rol
- **Estado**: FUNCIONANDO

#### 2. **Roles Disponibles:**
- **REQUESTER** (Solicitante): Puede crear tickets
- **AGENT** (Agente): Puede asignar y gestionar tickets
- **TECH** (Técnico): Puede resolver tickets asignados
- **ADMIN** (Administrador): Acceso completo

#### 3. **Ver Detalles de Usuario**
- Nombre
- Email
- Rol
- Área asignada
- Estado (activo/inactivo)
- **Estado**: FUNCIONANDO

---

## Perfil de Usuario

### Ubicación: `/profile`

### Funcionalidades:

#### 1. **Ver Información Personal**
- Nombre
- Email
- Teléfono
- Rol
- Área
- **Estado**: FUNCIONANDO

#### 2. **Editar Perfil**
- Cambiar nombre
- Cambiar teléfono
- Cambiar contraseña
- **Estado**: FUNCIONANDO

---

## Notificaciones

### Sistema de Notificaciones por Email:

1. **Nuevo Ticket Creado**
   - Notifica a agentes del área

2. **Ticket Asignado**
   - Notifica al técnico asignado

3. **Cambio de Estado**
   - Notifica al solicitante

4. **Nuevo Comentario**
   - Notifica a participantes del ticket

5. **SLA en Riesgo**
   - Notifica a supervisores

**Estado**: FUNCIONANDO

---

## Auditoría

### Sistema de Trazabilidad:

Todas las acciones se registran:
- Quién hizo la acción
- Qué se modificó
- Cuándo se hizo
- Detalles del cambio

**Acciones auditadas:**
- Creación de tickets
- Cambios de estado
- Asignaciones
- Comentarios
- Cambios en áreas
- Cambios en SLAs

**Estado**: FUNCIONANDO

---

## Cómo Probar las Funcionalidades

### 1. Probar Backend Completo:
```bash
cd Back
node test-all-endpoints.js
```

Este script prueba:
- Health check
- Registro de usuario
- Login
- Creación de ticket
- Listado de tickets
- Detalles de ticket
- Agregar comentarios
- Cambiar estado de ticket
- Gestión de áreas

---

## Flujo de Trabajo Típico

### Caso de Uso: Problema con Computadora

1. **Solicitante** (REQUESTER):
   - Inicia sesión
   - Crea ticket: "Computadora no enciende"
   - Prioridad: ALTA
   - Área: Sistemas

2. **Sistema**:
   - Notifica a agentes del área de Sistemas
   - Inicia contador de SLA

3. **Agente** (AGENT):
   - Revisa ticket nuevo
   - Asigna a técnico disponible
   - Cambia estado a "En Progreso"

4. **Técnico** (TECH):
   - Recibe notificación
   - Revisa ticket
   - Agrega comentario: "Revisando hardware"
   - Sube foto del problema

5. **Técnico** (TECH):
   - Resuelve problema
   - Agrega comentario: "Cable de poder desconectado"
   - Cambia estado a "Resuelto"

6. **Solicitante** (REQUESTER):
   - Recibe notificación
   - Confirma solución
   - Cierra ticket

---

## Características Visuales

### Colores de Prioridad:
- **Baja**: Verde (#28a745)
- **Media**: Amarillo (#ffc107)
- **Alta**: Naranja (#fd7e14)
- **Crítica**: Rojo (#dc3545)

### Colores de Estado:
- **Abierto**: Azul (#007bff)
- **En Progreso**: Cyan (#17a2b8)
- **Pendiente**: Amarillo (#ffc107)
- **Resuelto**: Verde (#28a745)
- **Cerrado**: Gris (#6c757d)

---

## Seguridad

### Implementado:
- Autenticación JWT
- Tokens de acceso (24h)
- Tokens de refresh (7d)
- Contraseñas hasheadas (bcrypt)
- Rate limiting (100 req/15min)
- CORS configurado
- Helmet.js (seguridad HTTP)
- Validación de datos

---

## Soporte

Si encuentras algún problema:

1. Verifica que backend y frontend estén corriendo
2. Revisa la consola del navegador (F12)
3. Revisa los logs del backend
4. Ejecuta el script de pruebas: `node test-all-endpoints.js`

---

## Checklist de Funcionalidades

- [x] Autenticación (Login/Registro)
- [x] Dashboard con estadísticas
- [x] Crear tickets
- [x] Ver detalles de tickets
- [x] Comentarios en tickets
- [x] Adjuntar archivos
- [x] Asignar tickets
- [x] Cambiar estado de tickets
- [x] Gestión de áreas
- [x] Gestión de SLAs
- [x] Gestión de usuarios
- [x] Perfil de usuario
- [x] Notificaciones por email
- [x] Auditoría completa
- [x] Búsqueda y filtros
- [x] Paginación



