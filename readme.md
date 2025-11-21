# Hospi-Desk

> Sistema de Gestión de Tickets Hospitalarios basado en Domain-Driven Design (DDD) y Clean Architecture

**Autor:** Juan Miguel Ramírez Mancilla  
**Versión:** 1.0  
**Fecha:** Noviembre 2025

---

## 📋 Tabla de Contenidos

- [Instrucciones de Instalación](#-instrucciones-de-instalación)
- [Catálogo de Patrones de Diseño](#-catálogo-de-patrones-de-diseño)
  - [1. Repository Pattern](#1-repository-pattern)
  - [2. Strategy Pattern](#2-strategy-pattern)
  - [3. Event Bus / Domain Events](#3-event-bus--domain-events)
  - [4. Value Object](#4-value-object)
  - [5. Dependency Injection](#5-dependency-injection)
  - [6. CQRS](#6-cqrs-command-query-responsibility-segregation)
  - [7. Middleware Pattern](#7-middleware-pattern)
  - [8. Factory Pattern](#8-factory-pattern)
  - [9. RBAC](#9-rbac-role-based-access-control)
  - [10. Adapter Pattern](#10-adapter-pattern)
  - [11. Mapper Pattern](#11-mapper-pattern)
  - [12. Domain Service](#12-domain-service)
- [Diccionario de Datos](#-diccionario-de-datos)
  - [Tipos Enumerados](#tipos-enumerados)
  - [Tablas del Sistema](#tablas-del-sistema)
  - [Relaciones](#relaciones)
  - [Índices y Restricciones](#índices-y-restricciones)

---

## 🚀 Instrucciones de Instalación

### Requisitos Previos
- Node.js (versión recomendada: LTS)
- npm o yarn
- PostgreSQL

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar Base de Datos**
   - Crear un archivo `.env` en la raíz del proyecto
   - Configurar la cadena de conexión de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/hospi_desk"
   ```

3. **Ejecutar el Proyecto**
   ```bash
   npm run dev
   ```

> **⚠️ NOTA IMPORTANTE:** Asegúrate de tener Node.js instalado y ejecutar `npm install` antes de iniciar el proyecto.

---

## 🎨 Catálogo de Patrones de Diseño

Este proyecto implementa múltiples patrones de diseño basados en **Domain-Driven Design (DDD)** y **Clean Architecture** para garantizar un código mantenible, escalable y testeable.

### 1. Repository Pattern

**📍 Ubicación:** `src/infrastructure/repositories/PrismaTicketRepository.ts`

**🎯 Propósito:** Abstraer la lógica de persistencia de datos del dominio.

**✅ Ventaja:** Permite cambiar Prisma por otro ORM o fuente de datos sin afectar la lógica del dominio.

**Ejemplo de implementación:**
```typescript
export interface TicketRepository {
  findById(id: string): Promise<Ticket>;
  save(ticket: Ticket): Promise<void>;
}

export class PrismaTicketRepository implements TicketRepository {
  async findById(id: string): Promise<Ticket> {
    return prisma.ticket.findUnique({ where: { id } });
  }
}
```

---

### 2. Strategy Pattern

**📍 Ubicación:** `src/domain/services/SlaCalculator.ts`

**🎯 Propósito:** Permitir distintas estrategias de cálculo de SLA según tipo de ticket.

**✅ Ventaja:** Facilita agregar nuevas políticas sin modificar el código existente.

---

### 3. Event Bus / Domain Events

**📍 Ubicación:** `src/infrastructure/events/`

**🎯 Propósito:** Manejar eventos del dominio como `TicketCreated`, `SlaBreached`.

**✅ Ventaja:** Desacopla los módulos y permite reacciones asíncronas (por ejemplo, enviar correo o notificación).

---

### 4. Value Object

**📍 Ubicación:** `src/domain/value-objects/Email.ts`, `src/domain/value-objects/Priority.ts`

**🎯 Propósito:** Encapsular valores inmutables y validar su creación.

**Ejemplo de implementación:**
```typescript
export class Email {
  constructor(private readonly value: string) {
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(value))
      throw new Error('Email inválido');
  }
  getValue() {
    return this.value;
  }
}
```

---

### 5. Dependency Injection

**📍 Ubicación:** `src/main.ts`

**🎯 Propósito:** Inyectar dependencias en lugar de crearlas directamente.

**✅ Ventaja:** Facilita el testing y la extensión del sistema.

---

### 6. CQRS (Command Query Responsibility Segregation)

**📍 Ubicación:** `src/application/use-cases/`

**🎯 Propósito:** Separar operaciones de lectura (queries) y escritura (commands).

**Ejemplo:** `CreateTicket` (command) vs `ListTickets` (query)

---

### 7. Middleware Pattern

**📍 Ubicación:** `src/interfaces/http/middlewares/`

**🎯 Propósito:** Interceptar peticiones HTTP para manejar autenticación, validación o rate limiting.

---

### 8. Factory Pattern

**📍 Ubicación:** `src/domain/services/TicketFactory.ts`

**🎯 Propósito:** Centralizar la creación de entidades complejas.

---

### 9. RBAC (Role-Based Access Control)

**📍 Ubicación:** `src/infrastructure/security/`

**🎯 Propósito:** Controlar el acceso según roles (Admin, Agente, Usuario).

---

### 10. Adapter Pattern

**📍 Ubicación:** `src/infrastructure/notif/`

**🎯 Propósito:** Unificar distintas formas de notificación (Email, SMS, Webhook).

---

### 11. Mapper Pattern

**📍 Ubicación:** `src/interfaces/mappers/`

**🎯 Propósito:** Convertir DTOs a entidades de dominio y viceversa.

---

### 12. Domain Service

**📍 Ubicación:** `src/domain/services/`

**🎯 Propósito:** Encapsular lógica que pertenece al dominio, pero no a una sola entidad.

---

## 📊 Diccionario de Datos

### Información General

**Base de Datos:** PostgreSQL  
**ORM:** Prisma  
**Versión:** 1.0

**Características principales:**
- ✅ Gestión multiárea con SLAs configurables
- ✅ Sistema de roles y permisos (RBAC)
- ✅ Auditoría completa de acciones
- ✅ Gestión de adjuntos y comentarios
- ✅ Base de conocimientos integrada

---

## Tipos Enumerados

### Priority
Nivel de prioridad de tickets y SLAs

| Valor | Descripción | Uso |
|-------|-------------|-----|
| `LOW` | Prioridad baja | Tickets que no requieren atención inmediata |
| `MEDIUM` | Prioridad media | Tickets con importancia moderada |
| `HIGH` | Prioridad alta | Tickets que requieren atención pronta |
| `CRITICAL` | Prioridad crítica | Tickets que afectan operaciones críticas |

---

### Status
Estado del ciclo de vida de un ticket

| Valor | Descripción | Transiciones Permitidas |
|-------|-------------|------------------------|
| `OPEN` | Ticket recién creado | → IN_PROGRESS, PENDING |
| `IN_PROGRESS` | Ticket en proceso de resolución | → PENDING, RESOLVED, OPEN |
| `PENDING` | Ticket en espera de información | → IN_PROGRESS, RESOLVED |
| `RESOLVED` | Ticket resuelto | → CLOSED, OPEN |
| `CLOSED` | Ticket cerrado definitivamente | → (ninguna) |

---

### Role
Rol del usuario en el sistema

| Valor | Descripción | Permisos |
|-------|-------------|----------|
| `REQUESTER` | Usuario solicitante | Crear y visualizar sus propios tickets |
| `AGENT` | Agente de soporte | Gestionar tickets asignados |
| `TECH` | Técnico especializado | Resolver tickets técnicos |
| `ADMIN` | Administrador del sistema | Acceso completo al sistema |

---

## Tablas del Sistema

### 1. Area

Representa las diferentes áreas o departamentos del hospital (TI, Mantenimiento, Administración, etc.)

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del área |
| name | VARCHAR(255) | NO | - | - | Nombre del área/departamento |
| description | TEXT | SI | - | - | Descripción detallada del área |
| isActive | BOOLEAN | NO | - | `true` | Indica si el área está activa |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ El nombre del área debe ser único
- ✓ Solo áreas activas pueden recibir nuevos tickets
- ✓ Al desactivar un área, los tickets existentes no se afectan

---

### 2. SLA (Service Level Agreement)

Define los acuerdos de nivel de servicio por área y prioridad

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del SLA |
| areaId | UUID | NO | FK → Area | - | Área a la que aplica este SLA |
| priority | Priority | NO | - | - | Nivel de prioridad |
| responseTimeMinutes | INTEGER | NO | - | - | Tiempo máximo de primera respuesta (minutos) |
| resolutionTimeMinutes | INTEGER | NO | - | - | Tiempo máximo de resolución (minutos) |
| isActive | BOOLEAN | NO | - | `true` | Indica si el SLA está activo |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ `resolutionTimeMinutes` debe ser mayor que `responseTimeMinutes`
- ✓ Solo puede haber un SLA activo por combinación de área + prioridad
- ✓ Los tiempos se miden en minutos hábiles

---

### 3. Workflow

Define flujos de trabajo personalizados por área

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del workflow |
| areaId | UUID | NO | FK → Area | - | Área a la que pertenece el workflow |
| transitions | JSONB | NO | - | - | Definición de transiciones de estado permitidas |
| requiredFields | JSONB | NO | - | - | Campos requeridos por estado |

**Ejemplo de transitions:**
```json
{
  "OPEN": ["IN_PROGRESS", "PENDING"],
  "IN_PROGRESS": ["PENDING", "RESOLVED", "OPEN"],
  "PENDING": ["IN_PROGRESS", "RESOLVED"],
  "RESOLVED": ["CLOSED", "OPEN"],
  "CLOSED": []
}
```

**Ejemplo de requiredFields:**
```json
{
  "RESOLVED": ["resolution"],
  "CLOSED": ["resolution", "closedAt"]
}
```

---

### 4. User

Usuarios del sistema con roles y permisos

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del usuario |
| name | VARCHAR(255) | NO | - | - | Nombre completo del usuario |
| email | VARCHAR(255) | NO | UNIQUE | - | Correo electrónico único |
| phone | VARCHAR(20) | SI | - | - | Número de teléfono de contacto |
| role | Role | NO | - | - | Rol del usuario en el sistema |
| passwordHash | VARCHAR(255) | NO | - | - | Hash bcrypt de la contraseña |
| isActive | BOOLEAN | NO | - | `true` | Indica si el usuario está activo |
| areaId | UUID | SI | FK → Area | - | Área a la que pertenece el usuario |
| passwordResetToken | VARCHAR(255) | SI | - | - | Token temporal para reset de contraseña |
| passwordResetExpires | TIMESTAMP | SI | - | - | Fecha de expiración del token de reset |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ El email debe ser único en el sistema
- ✓ La contraseña debe tener mínimo 8 caracteres
- ✓ El token de reset expira después de 1 hora
- ✓ Usuarios inactivos no pueden acceder al sistema

---

### 5. Ticket

Representa una solicitud de soporte o servicio

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del ticket |
| title | VARCHAR(255) | NO | - | - | Título descriptivo del ticket |
| description | TEXT | NO | - | - | Descripción detallada del problema |
| priority | Priority | NO | - | - | Nivel de prioridad |
| status | Status | NO | - | `OPEN` | Estado actual del ticket |
| areaId | UUID | NO | FK → Area | - | Área responsable del ticket |
| requesterId | UUID | NO | FK → User | - | Usuario que creó el ticket |
| assignedToId | UUID | SI | FK → User | - | Usuario asignado para resolver |
| resolvedAt | TIMESTAMP | SI | - | - | Fecha y hora de resolución |
| closedAt | TIMESTAMP | SI | - | - | Fecha y hora de cierre |
| resolution | TEXT | SI | - | - | Descripción de la solución aplicada |
| responseTime | TIMESTAMP | SI | - | - | Timestamp de primera respuesta |
| resolutionTime | TIMESTAMP | SI | - | - | Timestamp de resolución |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ Un ticket cerrado no puede cambiar de estado
- ✓ `resolvedAt` se establece automáticamente al cambiar status a RESOLVED
- ✓ `closedAt` se establece automáticamente al cambiar status a CLOSED
- ✓ El campo `resolution` es obligatorio para status RESOLVED o CLOSED

---

### 6. Comment

Comentarios y comunicaciones en un ticket

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del comentario |
| ticketId | UUID | NO | FK → Ticket | - | Ticket al que pertenece el comentario |
| userId | UUID | NO | FK → User | - | Usuario autor del comentario |
| content | TEXT | NO | - | - | Contenido del comentario |
| isInternal | BOOLEAN | NO | - | `false` | Si es un comentario interno |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ Comentarios internos solo son visibles para AGENT, TECH y ADMIN
- ✓ No se pueden eliminar comentarios, solo marcar como editados

---

### 7. Attachment

Archivos adjuntos a tickets

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del adjunto |
| ticketId | UUID | NO | FK → Ticket | - | Ticket al que pertenece el adjunto |
| userId | UUID | NO | FK → User | - | Usuario que subió el archivo |
| fileName | VARCHAR(255) | NO | - | - | Nombre original del archivo |
| filePath | VARCHAR(500) | NO | - | - | Ruta de almacenamiento del archivo |
| mimeType | VARCHAR(100) | NO | - | - | Tipo MIME del archivo |
| fileSize | INTEGER | NO | - | - | Tamaño del archivo en bytes |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de subida |

**Reglas de negocio:**
- ✓ Tamaño máximo por archivo: 10MB (configurable)
- ✓ Tipos de archivo permitidos: imágenes, PDFs, documentos Office
- ✓ Al eliminar un ticket, se eliminan físicamente sus adjuntos

---

### 8. AuditTrail

Registro de auditoría de todas las acciones sobre tickets

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del registro |
| ticketId | UUID | NO | FK → Ticket | - | Ticket auditado |
| actorId | UUID | NO | FK → User | - | Usuario que realizó la acción |
| action | VARCHAR(100) | NO | - | - | Tipo de acción realizada |
| details | JSONB | SI | - | - | Detalles adicionales de la acción |
| occurredAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de la acción |

**Ejemplo de details:**
```json
{
  "field": "status",
  "oldValue": "OPEN",
  "newValue": "IN_PROGRESS",
  "reason": "Iniciando investigación"
}
```

**Acciones registradas:**
- `TICKET_CREATED`
- `STATUS_CHANGED`
- `ASSIGNED`
- `PRIORITY_CHANGED`
- `COMMENT_ADDED`
- `ATTACHMENT_ADDED`
- `RESOLVED`
- `CLOSED`

---

### 9. KnowledgeArticle

Artículos de base de conocimientos para soluciones comunes

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| id | UUID | NO | PK | `uuid()` | Identificador único del artículo |
| title | VARCHAR(255) | NO | - | - | Título del artículo |
| content | TEXT | NO | - | - | Contenido completo del artículo (Markdown) |
| areaId | UUID | SI | FK → Area | - | Área relacionada (opcional) |
| tags | VARCHAR[] | NO | - | `[]` | Etiquetas para búsqueda |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización |

**Reglas de negocio:**
- ✓ El contenido se almacena en formato Markdown
- ✓ Los artículos pueden ser globales (sin área) o específicos de un área
- ✓ Las etiquetas se usan para búsqueda y categorización

---

## Relaciones

### Diagrama de Relaciones Principales

```
Area (1) ─────< (N) Ticket
  │                   │
  │                   ├─< Comment (N)
  │                   ├─< Attachment (N)
  │                   └─< AuditTrail (N)
  │
  ├─< SLA (N)
  ├─< Workflow (N)
  ├─< User (N)
  └─< KnowledgeArticle (N)

User (1) ─────< (N) Ticket (requester)
User (1) ─────< (N) Ticket (assignee)
User (1) ─────< (N) Comment
User (1) ─────< (N) AuditTrail
```

### Detalle de Relaciones

| Tabla Origen | Campo | Tabla Destino | Tipo | Acción OnDelete |
|--------------|-------|---------------|------|-----------------|
| SLA | areaId | Area | N:1 | CASCADE |
| Workflow | areaId | Area | N:1 | CASCADE |
| User | areaId | Area | N:1 | SET NULL |
| Ticket | areaId | Area | N:1 | RESTRICT |
| Ticket | requesterId | User | N:1 | RESTRICT |
| Ticket | assignedToId | User | N:1 | SET NULL |
| Comment | ticketId | Ticket | N:1 | CASCADE |
| Comment | userId | User | N:1 | RESTRICT |
| Attachment | ticketId | Ticket | N:1 | CASCADE |
| AuditTrail | ticketId | Ticket | N:1 | CASCADE |
| AuditTrail | actorId | User | N:1 | RESTRICT |
| KnowledgeArticle | areaId | Area | N:1 | SET NULL |

---

## Índices y Restricciones

### Índices Únicos
- `User.email` - UNIQUE
- `Area.id` - PRIMARY KEY
- `SLA.id` - PRIMARY KEY
- `Ticket.id` - PRIMARY KEY
- `User.id` - PRIMARY KEY

### Índices Recomendados (Performance)

```sql
-- Búsqueda de tickets por estado y área
CREATE INDEX idx_ticket_status_area ON Ticket(status, areaId);

-- Búsqueda de tickets por usuario solicitante
CREATE INDEX idx_ticket_requester ON Ticket(requesterId);

-- Búsqueda de tickets asignados
CREATE INDEX idx_ticket_assignee ON Ticket(assignedToId) WHERE assignedToId IS NOT NULL;

-- Búsqueda de SLAs activos por área
CREATE INDEX idx_sla_area_active ON SLA(areaId, priority) WHERE isActive = true;

-- Búsqueda de comentarios por ticket
CREATE INDEX idx_comment_ticket ON Comment(ticketId, createdAt DESC);

-- Búsqueda de auditoría por ticket
CREATE INDEX idx_audit_ticket ON AuditTrail(ticketId, occurredAt DESC);

-- Búsqueda de artículos por tags
CREATE INDEX idx_knowledge_tags ON KnowledgeArticle USING GIN(tags);
```

### Restricciones de Integridad

```sql
-- SLA: tiempo de resolución debe ser mayor que tiempo de respuesta
ALTER TABLE SLA ADD CONSTRAINT chk_sla_times
  CHECK (resolutionTimeMinutes > responseTimeMinutes);

-- Ticket: fechas de resolución/cierre deben ser después de creación
ALTER TABLE Ticket ADD CONSTRAINT chk_ticket_resolved
  CHECK (resolvedAt IS NULL OR resolvedAt >= createdAt);

ALTER TABLE Ticket ADD CONSTRAINT chk_ticket_closed
  CHECK (closedAt IS NULL OR closedAt >= createdAt);

-- Attachment: tamaño de archivo positivo
ALTER TABLE Attachment ADD CONSTRAINT chk_attachment_size
  CHECK (fileSize > 0);
```

---

## 📝 Notas Adicionales

### Convenciones de Nomenclatura
- **Tablas:** PascalCase singular (User, Ticket, Area)
- **Campos:** camelCase (createdAt, assignedToId)
- **Enums:** UPPER_CASE (OPEN, HIGH, ADMIN)

### Tipos de Datos Especiales
- **UUID:** Identificadores únicos universales (v4)
- **JSONB:** Datos JSON indexables (PostgreSQL)
- **TIMESTAMP:** Incluye zona horaria (timestamptz en PostgreSQL)
- **TEXT:** Sin límite de longitud
- **VARCHAR(n):** Longitud variable con límite

### Consideraciones de Seguridad
- 🔒 Las contraseñas se almacenan con hash bcrypt (cost factor: 10)
- 🔒 Los tokens de reset tienen expiración automática
- 🔒 Los comentarios internos tienen control de acceso por rol
- 🔒 Todos los cambios críticos se auditan en AuditTrail

---

## 📄 Licencia

Este proyecto es propiedad de Juan Miguel Ramírez Mancilla.

