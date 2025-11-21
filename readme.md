

                                       JUAN MIGUEL RAMIREZ MANCILLA

* PARA CORRER EL PROYECTO: SOLO CONECTAR NUESTRA BD EN EL .ENV , Y CON npm run dev EJECUTAR EL PROYECTO. 

* NOTA IMPORTANTE : INSTALAR NODE , NPM INSTALL  !!



# Catálogo de Patrones de Diseño — Proyecto Hospi-Desk

Este documento describe los patrones de diseño y arquitectura aplicados en el proyecto **Hospi-Desk**, basado en **Domain-Driven Design (DDD)** y **Clean Architecture**.

---

1. Repository Pattern
Ubicación: `src/infrastructure/repositories/PrismaTicketRepository.ts`  
Propósito: Abstraer la lógica de persistencia de datos del dominio.  
Ventaja: Permite cambiar Prisma por otro ORM o fuente de datos sin afectar la lógica del dominio.  

Ejemplo:
```ts

export interface TicketRepository {
  findById(id: string): Promise<Ticket>;
  save(ticket: Ticket): Promise<void>;
}


export class PrismaTicketRepository implements TicketRepository {
  async findById(id: string): Promise<Ticket> {
    return prisma.ticket.findUnique({ where: { id } });
  }
}

2. Strategy Pattern

Ubicación: src/domain/services/SlaCalculator.ts
Propósito: Permitir distintas estrategias de cálculo de SLA según tipo de ticket.
Ventaja: Facilita agregar nuevas políticas sin modificar el código existente.

3. Event Bus / Domain Events

Ubicación: src/infrastructure/events/
Propósito: Manejar eventos del dominio como TicketCreated, SlaBreached.
Ventaja: Desacopla los módulos y permite reacciones asíncronas (por ejemplo, enviar correo o notificación).

4. Value Object

Ubicación: src/domain/value-objects/Email.ts, src/domain/value-objects/Priority.ts
Propósito: Encapsular valores inmutables y validar su creación.
Ejemplo:

export class Email {
  constructor(private readonly value: string) {
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(value))
      throw new Error('Email inválido');
  }
  getValue() {
    return this.value;
  }
}

5. Dependency Injection

Ubicación: src/main.ts
Propósito: Inyectar dependencias en lugar de crearlas directamente.
Ventaja: Facilita el testing y la extensión del sistema.

6. CQRS (Command Query Responsibility Segregation)

Ubicación: src/application/use-cases/
Propósito: Separar operaciones de lectura (queries) y escritura (commands).
Ejemplo: CreateTicket (command) vs ListTickets (query)

7. Middleware Pattern

Ubicación: src/interfaces/http/middlewares/
Propósito: Interceptar peticiones HTTP para manejar autenticación, validación o rate limiting.

8. Factory Pattern

Ubicación: src/domain/services/TicketFactory.ts
Propósito: Centralizar la creación de entidades complejas.

9. RBAC (Role-Based Access Control)

Ubicación: src/infrastructure/security/
Propósito: Controlar el acceso según roles (Admin, Agente, Usuario).

10. Adapter Pattern

Ubicación: src/infrastructure/notif/
Propósito: Unificar distintas formas de notificación (Email, SMS, Webhook).

11. Mapper Pattern

Ubicación: src/interfaces/mappers/
Propósito: Convertir DTOs a entidades de dominio y viceversa.

12. Domain Service

Ubicación: src/domain/services/
Propósito: Encapsular lógica que pertenece al dominio, pero no a una sola entidad.

## Diccionario de Datos - Hospi-Desk ##

**Proyecto:** Sistema de Gestión de Tickets Hospitalarios (Hospi-Desk)
**Versión:** 1.0
**Fecha:** Noviembre 2025
**Base de Datos:** PostgreSQL
**ORM:** Prisma

---

## Índice
1. [Descripción General](#descripción-general)
2. [Tipos Enumerados](#tipos-enumerados)
3. [Tablas](#tablas)
4. [Relaciones](#relaciones)
5. [Índices y Restricciones](#índices-y-restricciones)

---

## Descripción General

Este diccionario de datos documenta la estructura de la base de datos del sistema **Hospi-Desk**, una aplicación de gestión de tickets orientada al sector hospitalario. El sistema permite crear, asignar y dar seguimiento a tickets de soporte técnico y solicitudes de servicio.

**Características principales:**
- Gestión multiárea con SLAs configurables
- Sistema de roles y permisos (RBAC)
- Auditoría completa de acciones
- Gestión de adjuntos y comentarios
- Base de conocimientos integrada

---

## Tipos Enumerados

### Priority
**Descripción:** Nivel de prioridad de tickets y SLAs

| Valor | Descripción | Uso |
|-------|-------------|-----|
| `LOW` | Prioridad baja | Tickets que no requieren atención inmediata |
| `MEDIUM` | Prioridad media | Tickets con importancia moderada |
| `HIGH` | Prioridad alta | Tickets que requieren atención pronta |
| `CRITICAL` | Prioridad crítica | Tickets que afectan operaciones críticas |

---

### Status
**Descripción:** Estado del ciclo de vida de un ticket

| Valor | Descripción | Transiciones Permitidas |
|-------|-------------|------------------------|
| `OPEN` | Ticket recién creado | → IN_PROGRESS, PENDING |
| `IN_PROGRESS` | Ticket en proceso de resolución | → PENDING, RESOLVED, OPEN |
| `PENDING` | Ticket en espera de información | → IN_PROGRESS, RESOLVED |
| `RESOLVED` | Ticket resuelto | → CLOSED, OPEN |
| `CLOSED` | Ticket cerrado definitivamente | → (ninguna) |

---

### Role
**Descripción:** Rol del usuario en el sistema

| Valor | Descripción | Permisos |
|-------|-------------|----------|
| `REQUESTER` | Usuario solicitante | Crear y visualizar sus propios tickets |
| `AGENT` | Agente de soporte | Gestionar tickets asignados |
| `TECH` | Técnico especializado | Resolver tickets técnicos |
| `ADMIN` | Administrador del sistema | Acceso completo al sistema |

---

## Tablas

### 1. Area

**Descripción:** Representa las diferentes áreas o departamentos del hospital (TI, Mantenimiento, Administración, etc.)

**Nombre en BD:** `Area`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del área | `550e8400-e29b-41d4-a716-446655440000` |
| name | VARCHAR(255) | NO | - | - | Nombre del área/departamento | `"Tecnologías de la Información"` |
| description | TEXT | SI | - | - | Descripción detallada del área | `"Área encargada de soporte técnico"` |
| isActive | BOOLEAN | NO | - | `true` | Indica si el área está activa | `true` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-15 10:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-20 14:30:00` |

**Reglas de negocio:**
- El nombre del área debe ser único
- Solo áreas activas pueden recibir nuevos tickets
- Al desactivar un área, los tickets existentes no se afectan

---

### 2. SLA (Service Level Agreement)

**Descripción:** Define los acuerdos de nivel de servicio por área y prioridad

**Nombre en BD:** `SLA`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del SLA | `660e8400-e29b-41d4-a716-446655440000` |
| areaId | UUID | NO | FK → Area | - | Área a la que aplica este SLA | `550e8400-...` |
| priority | Priority | NO | - | - | Nivel de prioridad (LOW, MEDIUM, HIGH, CRITICAL) | `HIGH` |
| responseTimeMinutes | INTEGER | NO | - | - | Tiempo máximo de primera respuesta (minutos) | `30` |
| resolutionTimeMinutes | INTEGER | NO | - | - | Tiempo máximo de resolución (minutos) | `240` |
| isActive | BOOLEAN | NO | - | `true` | Indica si el SLA está activo | `true` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-15 10:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-20 14:30:00` |

**Relaciones:**
- `area` → **Area** (N:1)

**Reglas de negocio:**
- `resolutionTimeMinutes` debe ser mayor que `responseTimeMinutes`
- Solo puede haber un SLA activo por combinación de área + prioridad
- Los tiempos se miden en minutos hábiles

---

### 3. Workflow

**Descripción:** Define flujos de trabajo personalizados por área

**Nombre en BD:** `Workflow`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del workflow | `770e8400-e29b-41d4-a716-446655440000` |
| areaId | UUID | NO | FK → Area | - | Área a la que pertenece el workflow | `550e8400-...` |
| transitions | JSONB | NO | - | - | Definición de transiciones de estado permitidas | Ver ejemplo JSON* |
| requiredFields | JSONB | NO | - | - | Campos requeridos por estado | Ver ejemplo JSON** |

**Relaciones:**
- `area` → **Area** (N:1)

**Ejemplo JSON* (transitions):**
```json
{
  "OPEN": ["IN_PROGRESS", "PENDING"],
  "IN_PROGRESS": ["PENDING", "RESOLVED", "OPEN"],
  "PENDING": ["IN_PROGRESS", "RESOLVED"],
  "RESOLVED": ["CLOSED", "OPEN"],
  "CLOSED": []
}
```

**Ejemplo JSON** (requiredFields):**
```json
{
  "RESOLVED": ["resolution"],
  "CLOSED": ["resolution", "closedAt"]
}
```

---

### 4. User

**Descripción:** Usuarios del sistema con roles y permisos

**Nombre en BD:** `User`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del usuario | `880e8400-e29b-41d4-a716-446655440000` |
| name | VARCHAR(255) | NO | - | - | Nombre completo del usuario | `"Juan Pérez García"` |
| email | VARCHAR(255) | NO | UNIQUE | - | Correo electrónico único | `"juan.perez@hospital.com"` |
| phone | VARCHAR(20) | SI | - | - | Número de teléfono de contacto | `"+57 300 123 4567"` |
| role | Role | NO | - | - | Rol del usuario en el sistema | `AGENT` |
| passwordHash | VARCHAR(255) | NO | - | - | Hash bcrypt de la contraseña | `"$2b$10$..."` |
| isActive | BOOLEAN | NO | - | `true` | Indica si el usuario está activo | `true` |
| areaId | UUID | SI | FK → Area | - | Área a la que pertenece el usuario | `550e8400-...` |
| passwordResetToken | VARCHAR(255) | SI | - | - | Token temporal para reset de contraseña | `"abc123xyz..."` |
| passwordResetExpires | TIMESTAMP | SI | - | - | Fecha de expiración del token de reset | `2025-01-15 12:00:00` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-10 09:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-15 10:30:00` |

**Relaciones:**
- `area` → **Area** (N:1) - Opcional
- `requestedTickets` → **Ticket[]** (1:N)
- `assignedTickets` → **Ticket[]** (1:N)
- `comments` → **Comment[]** (1:N)
- `auditTrails` → **AuditTrail[]** (1:N)

**Reglas de negocio:**
- El email debe ser único en el sistema
- La contraseña debe tener mínimo 8 caracteres
- El token de reset expira después de 1 hora
- Usuarios inactivos no pueden acceder al sistema

---

### 5. Ticket

**Descripción:** Representa una solicitud de soporte o servicio

**Nombre en BD:** `Ticket`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del ticket | `990e8400-e29b-41d4-a716-446655440000` |
| title | VARCHAR(255) | NO | - | - | Título descriptivo del ticket | `"Error en sistema de facturación"` |
| description | TEXT | NO | - | - | Descripción detallada del problema | `"Al intentar generar factura aparece error 500"` |
| priority | Priority | NO | - | - | Nivel de prioridad | `HIGH` |
| status | Status | NO | - | `OPEN` | Estado actual del ticket | `IN_PROGRESS` |
| areaId | UUID | NO | FK → Area | - | Área responsable del ticket | `550e8400-...` |
| requesterId | UUID | NO | FK → User | - | Usuario que creó el ticket | `880e8400-...` |
| assignedToId | UUID | SI | FK → User | - | Usuario asignado para resolver | `881e8400-...` |
| resolvedAt | TIMESTAMP | SI | - | - | Fecha y hora de resolución | `2025-01-15 14:30:00` |
| closedAt | TIMESTAMP | SI | - | - | Fecha y hora de cierre | `2025-01-15 15:00:00` |
| resolution | TEXT | SI | - | - | Descripción de la solución aplicada | `"Se reinició el servicio de base de datos"` |
| responseTime | TIMESTAMP | SI | - | - | Timestamp de primera respuesta | `2025-01-15 10:30:00` |
| resolutionTime | TIMESTAMP | SI | - | - | Timestamp de resolución | `2025-01-15 14:30:00` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-15 10:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-15 14:30:00` |

**Relaciones:**
- `area` → **Area** (N:1)
- `requester` → **User** (N:1)
- `assignee` → **User** (N:1) - Opcional
- `comments` → **Comment[]** (1:N)
- `attachments` → **Attachment[]** (1:N)
- `auditTrails` → **AuditTrail[]** (1:N)

**Reglas de negocio:**
- Un ticket cerrado no puede cambiar de estado
- `resolvedAt` se establece automáticamente al cambiar status a RESOLVED
- `closedAt` se establece automáticamente al cambiar status a CLOSED
- El campo `resolution` es obligatorio para status RESOLVED o CLOSED

---

### 6. Comment

**Descripción:** Comentarios y comunicaciones en un ticket

**Nombre en BD:** `Comment`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del comentario | `aa0e8400-e29b-41d4-a716-446655440000` |
| ticketId | UUID | NO | FK → Ticket | - | Ticket al que pertenece el comentario | `990e8400-...` |
| userId | UUID | NO | FK → User | - | Usuario autor del comentario | `880e8400-...` |
| content | TEXT | NO | - | - | Contenido del comentario | `"Se está investigando el problema"` |
| isInternal | BOOLEAN | NO | - | `false` | Si es un comentario interno (no visible para requester) | `false` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-15 11:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-15 11:05:00` |

**Relaciones:**
- `ticket` → **Ticket** (N:1)
- `author` → **User** (N:1)

**Reglas de negocio:**
- Comentarios internos solo son visibles para AGENT, TECH y ADMIN
- No se pueden eliminar comentarios, solo marcar como editados

---

### 7. Attachment

**Descripción:** Archivos adjuntos a tickets

**Nombre en BD:** `Attachment`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del adjunto | `bb0e8400-e29b-41d4-a716-446655440000` |
| ticketId | UUID | NO | FK → Ticket | - | Ticket al que pertenece el adjunto | `990e8400-...` |
| userId | UUID | NO | FK → User | - | Usuario que subió el archivo | `880e8400-...` |
| fileName | VARCHAR(255) | NO | - | - | Nombre original del archivo | `"captura_error.png"` |
| filePath | VARCHAR(500) | NO | - | - | Ruta de almacenamiento del archivo | `"/uploads/2025/01/uuid-file.png"` |
| mimeType | VARCHAR(100) | NO | - | - | Tipo MIME del archivo | `"image/png"` |
| fileSize | INTEGER | NO | - | - | Tamaño del archivo en bytes | `1048576` (1MB) |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de subida | `2025-01-15 10:15:00` |

**Relaciones:**
- `ticket` → **Ticket** (N:1)

**Reglas de negocio:**
- Tamaño máximo por archivo: 10MB (configurable)
- Tipos de archivo permitidos: imágenes, PDFs, documentos Office
- Al eliminar un ticket, se eliminan físicamente sus adjuntos

---

### 8. AuditTrail

**Descripción:** Registro de auditoría de todas las acciones sobre tickets

**Nombre en BD:** `AuditTrail`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del registro | `cc0e8400-e29b-41d4-a716-446655440000` |
| ticketId | UUID | NO | FK → Ticket | - | Ticket auditado | `990e8400-...` |
| actorId | UUID | NO | FK → User | - | Usuario que realizó la acción | `880e8400-...` |
| action | VARCHAR(100) | NO | - | - | Tipo de acción realizada | `"STATUS_CHANGED"` |
| details | JSONB | SI | - | - | Detalles adicionales de la acción | Ver ejemplo JSON*** |
| occurredAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de la acción | `2025-01-15 12:00:00` |

**Relaciones:**
- `ticket` → **Ticket** (N:1)
- `actor` → **User** (N:1)

**Ejemplo JSON*** (details):**
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

**Descripción:** Artículos de base de conocimientos para soluciones comunes

**Nombre en BD:** `KnowledgeArticle`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción | Ejemplo |
|-------|------|------|-------|---------|-------------|---------|
| id | UUID | NO | PK | `uuid()` | Identificador único del artículo | `dd0e8400-e29b-41d4-a716-446655440000` |
| title | VARCHAR(255) | NO | - | - | Título del artículo | `"Cómo reiniciar el servidor de impresión"` |
| content | TEXT | NO | - | - | Contenido completo del artículo (Markdown) | `"## Pasos\n1. Acceder a..."` |
| areaId | UUID | SI | FK → Area | - | Área relacionada (opcional) | `550e8400-...` |
| tags | VARCHAR[] | NO | - | `[]` | Etiquetas para búsqueda | `["impresión", "servidor", "windows"]` |
| createdAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de creación | `2025-01-10 09:00:00` |
| updatedAt | TIMESTAMP | NO | - | `now()` | Fecha y hora de última actualización | `2025-01-15 10:00:00` |

**Relaciones:**
- `area` → **Area** (N:1) - Opcional

**Reglas de negocio:**
- El contenido se almacena en formato Markdown
- Los artículos pueden ser globales (sin área) o específicos de un área
- Las etiquetas se usan para búsqueda y categorización

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
- etc.

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

**Check Constraints:**
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

## Notas Adicionales

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
- Las contraseñas se almacenan con hash bcrypt (cost factor: 10)
- Los tokens de reset tienen expiración automática
- Los comentarios internos tienen control de acceso por rol
- Todos los cambios críticos se auditan en AuditTrail

---

  


