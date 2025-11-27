-- =====================================================
-- Hospi-Desk - Database DDL (Data Definition Language)
-- =====================================================
-- Sistema de Gestión de Tickets Hospitalarios
-- Base de Datos: PostgreSQL 14+
-- Fecha: Noviembre 2025
-- Versión: 1.0
-- =====================================================

-- =====================================================
-- CLEANUP (opcional - para desarrollo)
-- =====================================================
-- Descomentar estas líneas para recrear la base de datos
/*
DROP TABLE IF EXISTS "AuditTrail" CASCADE;
DROP TABLE IF EXISTS "Attachment" CASCADE;
DROP TABLE IF EXISTS "Comment" CASCADE;
DROP TABLE IF EXISTS "Ticket" CASCADE;
DROP TABLE IF EXISTS "KnowledgeArticle" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Workflow" CASCADE;
DROP TABLE IF EXISTS "SLA" CASCADE;
DROP TABLE IF EXISTS "Area" CASCADE;
DROP TYPE IF EXISTS "Priority" CASCADE;
DROP TYPE IF EXISTS "Status" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
*/

-- =====================================================
-- TIPOS ENUMERADOS (ENUMS)
-- =====================================================

-- Nivel de prioridad de tickets y SLAs
CREATE TYPE "Priority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

COMMENT ON TYPE "Priority" IS 'Nivel de prioridad: LOW (baja), MEDIUM (media), HIGH (alta), CRITICAL (crítica)';

-- Estados del ciclo de vida de un ticket
CREATE TYPE "Status" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'PENDING',
    'RESOLVED',
    'CLOSED'
);

COMMENT ON TYPE "Status" IS 'Estado del ticket: OPEN (abierto), IN_PROGRESS (en progreso), PENDING (pendiente), RESOLVED (resuelto), CLOSED (cerrado)';

-- Roles de usuario en el sistema
CREATE TYPE "Role" AS ENUM (
    'REQUESTER',
    'AGENT',
    'TECH',
    'ADMIN'
);

COMMENT ON TYPE "Role" IS 'Rol del usuario: REQUESTER (solicitante), AGENT (agente), TECH (técnico), ADMIN (administrador)';

-- =====================================================
-- TABLA: Area
-- =====================================================
-- Representa áreas o departamentos del hospital
-- =====================================================

CREATE TABLE "Area" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "Area" IS 'Áreas o departamentos del hospital (TI, Mantenimiento, etc.)';
COMMENT ON COLUMN "Area"."id" IS 'Identificador único del área';
COMMENT ON COLUMN "Area"."name" IS 'Nombre del área o departamento';
COMMENT ON COLUMN "Area"."description" IS 'Descripción detallada del área';
COMMENT ON COLUMN "Area"."isActive" IS 'Indica si el área está activa y puede recibir tickets';
COMMENT ON COLUMN "Area"."createdAt" IS 'Fecha y hora de creación del área';
COMMENT ON COLUMN "Area"."updatedAt" IS 'Fecha y hora de última actualización';

-- =====================================================
-- TABLA: SLA (Service Level Agreement)
-- =====================================================
-- Define acuerdos de nivel de servicio por área y prioridad
-- =====================================================

CREATE TABLE "SLA" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "areaId" UUID NOT NULL,
    "priority" "Priority" NOT NULL,
    "responseTimeMinutes" INTEGER NOT NULL,
    "resolutionTimeMinutes" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "SLA_areaId_fkey"
        FOREIGN KEY ("areaId")
        REFERENCES "Area"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_sla_response_positive"
        CHECK ("responseTimeMinutes" > 0),

    CONSTRAINT "chk_sla_resolution_positive"
        CHECK ("resolutionTimeMinutes" > 0),

    CONSTRAINT "chk_sla_resolution_greater_response"
        CHECK ("resolutionTimeMinutes" > "responseTimeMinutes")
);

COMMENT ON TABLE "SLA" IS 'Acuerdos de nivel de servicio por área y prioridad';
COMMENT ON COLUMN "SLA"."id" IS 'Identificador único del SLA';
COMMENT ON COLUMN "SLA"."areaId" IS 'Área a la que aplica este SLA';
COMMENT ON COLUMN "SLA"."priority" IS 'Nivel de prioridad (LOW, MEDIUM, HIGH, CRITICAL)';
COMMENT ON COLUMN "SLA"."responseTimeMinutes" IS 'Tiempo máximo de primera respuesta en minutos';
COMMENT ON COLUMN "SLA"."resolutionTimeMinutes" IS 'Tiempo máximo de resolución en minutos';
COMMENT ON COLUMN "SLA"."isActive" IS 'Indica si el SLA está activo';

-- =====================================================
-- TABLA: Workflow
-- =====================================================
-- Define flujos de trabajo personalizados por área
-- =====================================================

CREATE TABLE "Workflow" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "areaId" UUID NOT NULL,
    "transitions" JSONB NOT NULL,
    "requiredFields" JSONB NOT NULL,

    -- Foreign Keys
    CONSTRAINT "Workflow_areaId_fkey"
        FOREIGN KEY ("areaId")
        REFERENCES "Area"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

COMMENT ON TABLE "Workflow" IS 'Flujos de trabajo personalizados por área';
COMMENT ON COLUMN "Workflow"."id" IS 'Identificador único del workflow';
COMMENT ON COLUMN "Workflow"."areaId" IS 'Área a la que pertenece el workflow';
COMMENT ON COLUMN "Workflow"."transitions" IS 'Definición de transiciones de estado permitidas (JSON)';
COMMENT ON COLUMN "Workflow"."requiredFields" IS 'Campos requeridos por estado (JSON)';

-- =====================================================
-- TABLA: User
-- =====================================================
-- Usuarios del sistema con roles y permisos
-- =====================================================

CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(20),
    "role" "Role" NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "areaId" UUID,
    "passwordResetToken" VARCHAR(255),
    "passwordResetExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "User_areaId_fkey"
        FOREIGN KEY ("areaId")
        REFERENCES "Area"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_user_email_format"
        CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE "User" IS 'Usuarios del sistema con roles y permisos';
COMMENT ON COLUMN "User"."id" IS 'Identificador único del usuario';
COMMENT ON COLUMN "User"."name" IS 'Nombre completo del usuario';
COMMENT ON COLUMN "User"."email" IS 'Correo electrónico único del usuario';
COMMENT ON COLUMN "User"."phone" IS 'Número de teléfono de contacto';
COMMENT ON COLUMN "User"."role" IS 'Rol del usuario en el sistema';
COMMENT ON COLUMN "User"."passwordHash" IS 'Hash bcrypt de la contraseña';
COMMENT ON COLUMN "User"."isActive" IS 'Indica si el usuario está activo';
COMMENT ON COLUMN "User"."areaId" IS 'Área a la que pertenece el usuario (opcional)';
COMMENT ON COLUMN "User"."passwordResetToken" IS 'Token temporal para reset de contraseña';
COMMENT ON COLUMN "User"."passwordResetExpires" IS 'Fecha de expiración del token de reset';

-- =====================================================
-- TABLA: Ticket
-- =====================================================
-- Solicitudes de soporte o servicio
-- =====================================================

CREATE TABLE "Ticket" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "areaId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "assignedToId" UUID,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "responseTime" TIMESTAMP(3),
    "resolutionTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "Ticket_areaId_fkey"
        FOREIGN KEY ("areaId")
        REFERENCES "Area"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT "Ticket_requesterId_fkey"
        FOREIGN KEY ("requesterId")
        REFERENCES "User"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT "Ticket_assignedToId_fkey"
        FOREIGN KEY ("assignedToId")
        REFERENCES "User"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_ticket_resolved_after_created"
        CHECK ("resolvedAt" IS NULL OR "resolvedAt" >= "createdAt"),

    CONSTRAINT "chk_ticket_closed_after_created"
        CHECK ("closedAt" IS NULL OR "closedAt" >= "createdAt"),

    CONSTRAINT "chk_ticket_closed_after_resolved"
        CHECK ("closedAt" IS NULL OR "resolvedAt" IS NULL OR "closedAt" >= "resolvedAt"),

    CONSTRAINT "chk_ticket_resolution_required"
        CHECK (
            ("status" NOT IN ('RESOLVED', 'CLOSED')) OR
            ("resolution" IS NOT NULL AND LENGTH(TRIM("resolution")) > 0)
        )
);

COMMENT ON TABLE "Ticket" IS 'Solicitudes de soporte o servicio';
COMMENT ON COLUMN "Ticket"."id" IS 'Identificador único del ticket';
COMMENT ON COLUMN "Ticket"."title" IS 'Título descriptivo del ticket';
COMMENT ON COLUMN "Ticket"."description" IS 'Descripción detallada del problema';
COMMENT ON COLUMN "Ticket"."priority" IS 'Nivel de prioridad del ticket';
COMMENT ON COLUMN "Ticket"."status" IS 'Estado actual del ticket';
COMMENT ON COLUMN "Ticket"."areaId" IS 'Área responsable del ticket';
COMMENT ON COLUMN "Ticket"."requesterId" IS 'Usuario que creó el ticket';
COMMENT ON COLUMN "Ticket"."assignedToId" IS 'Usuario asignado para resolver (opcional)';
COMMENT ON COLUMN "Ticket"."resolvedAt" IS 'Fecha y hora de resolución';
COMMENT ON COLUMN "Ticket"."closedAt" IS 'Fecha y hora de cierre';
COMMENT ON COLUMN "Ticket"."resolution" IS 'Descripción de la solución aplicada';
COMMENT ON COLUMN "Ticket"."responseTime" IS 'Timestamp de primera respuesta';
COMMENT ON COLUMN "Ticket"."resolutionTime" IS 'Timestamp de resolución efectiva';

-- =====================================================
-- TABLA: Comment
-- =====================================================
-- Comentarios y comunicaciones en tickets
-- =====================================================

CREATE TABLE "Comment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticketId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "Comment_ticketId_fkey"
        FOREIGN KEY ("ticketId")
        REFERENCES "Ticket"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT "Comment_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "User"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_comment_content_not_empty"
        CHECK (LENGTH(TRIM("content")) > 0)
);

COMMENT ON TABLE "Comment" IS 'Comentarios y comunicaciones en tickets';
COMMENT ON COLUMN "Comment"."id" IS 'Identificador único del comentario';
COMMENT ON COLUMN "Comment"."ticketId" IS 'Ticket al que pertenece el comentario';
COMMENT ON COLUMN "Comment"."userId" IS 'Usuario autor del comentario';
COMMENT ON COLUMN "Comment"."content" IS 'Contenido del comentario';
COMMENT ON COLUMN "Comment"."isInternal" IS 'Si es un comentario interno (no visible para requester)';

-- =====================================================
-- TABLA: Attachment
-- =====================================================
-- Archivos adjuntos a tickets
-- =====================================================

CREATE TABLE "Attachment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticketId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "Attachment_ticketId_fkey"
        FOREIGN KEY ("ticketId")
        REFERENCES "Ticket"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_attachment_filesize_positive"
        CHECK ("fileSize" > 0),

    CONSTRAINT "chk_attachment_filesize_max"
        CHECK ("fileSize" <= 10485760) -- 10MB máximo
);

COMMENT ON TABLE "Attachment" IS 'Archivos adjuntos a tickets';
COMMENT ON COLUMN "Attachment"."id" IS 'Identificador único del adjunto';
COMMENT ON COLUMN "Attachment"."ticketId" IS 'Ticket al que pertenece el adjunto';
COMMENT ON COLUMN "Attachment"."userId" IS 'Usuario que subió el archivo';
COMMENT ON COLUMN "Attachment"."fileName" IS 'Nombre original del archivo';
COMMENT ON COLUMN "Attachment"."filePath" IS 'Ruta de almacenamiento del archivo';
COMMENT ON COLUMN "Attachment"."mimeType" IS 'Tipo MIME del archivo';
COMMENT ON COLUMN "Attachment"."fileSize" IS 'Tamaño del archivo en bytes';

-- =====================================================
-- TABLA: AuditTrail
-- =====================================================
-- Registro de auditoría de acciones sobre tickets
-- =====================================================

CREATE TABLE "AuditTrail" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticketId" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "details" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "AuditTrail_ticketId_fkey"
        FOREIGN KEY ("ticketId")
        REFERENCES "Ticket"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT "AuditTrail_actorId_fkey"
        FOREIGN KEY ("actorId")
        REFERENCES "User"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

COMMENT ON TABLE "AuditTrail" IS 'Registro de auditoría de todas las acciones sobre tickets';
COMMENT ON COLUMN "AuditTrail"."id" IS 'Identificador único del registro de auditoría';
COMMENT ON COLUMN "AuditTrail"."ticketId" IS 'Ticket auditado';
COMMENT ON COLUMN "AuditTrail"."actorId" IS 'Usuario que realizó la acción';
COMMENT ON COLUMN "AuditTrail"."action" IS 'Tipo de acción realizada (STATUS_CHANGED, ASSIGNED, etc.)';
COMMENT ON COLUMN "AuditTrail"."details" IS 'Detalles adicionales de la acción en formato JSON';
COMMENT ON COLUMN "AuditTrail"."occurredAt" IS 'Fecha y hora en que ocurrió la acción';

-- =====================================================
-- TABLA: KnowledgeArticle
-- =====================================================
-- Base de conocimientos para soluciones comunes
-- =====================================================

CREATE TABLE "KnowledgeArticle" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "areaId" UUID,
    "tags" TEXT[] NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "KnowledgeArticle_areaId_fkey"
        FOREIGN KEY ("areaId")
        REFERENCES "Area"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- Check Constraints
    CONSTRAINT "chk_knowledge_title_not_empty"
        CHECK (LENGTH(TRIM("title")) > 0),

    CONSTRAINT "chk_knowledge_content_not_empty"
        CHECK (LENGTH(TRIM("content")) > 0)
);

COMMENT ON TABLE "KnowledgeArticle" IS 'Artículos de base de conocimientos para soluciones comunes';
COMMENT ON COLUMN "KnowledgeArticle"."id" IS 'Identificador único del artículo';
COMMENT ON COLUMN "KnowledgeArticle"."title" IS 'Título del artículo';
COMMENT ON COLUMN "KnowledgeArticle"."content" IS 'Contenido completo del artículo (formato Markdown)';
COMMENT ON COLUMN "KnowledgeArticle"."areaId" IS 'Área relacionada (opcional para artículos globales)';
COMMENT ON COLUMN "KnowledgeArticle"."tags" IS 'Etiquetas para búsqueda y categorización';

-- =====================================================
-- ÍNDICES DE PERFORMANCE
-- =====================================================

-- Índice único para email de usuario
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Índice compuesto para búsqueda de tickets por estado y área
CREATE INDEX "idx_ticket_status_area" ON "Ticket"("status", "areaId");

-- Índice para búsqueda de tickets por solicitante
CREATE INDEX "idx_ticket_requester" ON "Ticket"("requesterId", "createdAt" DESC);

-- Índice para búsqueda de tickets asignados a un usuario
CREATE INDEX "idx_ticket_assignee" ON "Ticket"("assignedToId", "status")
WHERE "assignedToId" IS NOT NULL;

-- Índice para búsqueda de tickets por fecha de creación
CREATE INDEX "idx_ticket_created" ON "Ticket"("createdAt" DESC);

-- Índice compuesto para SLAs activos por área y prioridad
CREATE INDEX "idx_sla_area_priority_active" ON "SLA"("areaId", "priority")
WHERE "isActive" = true;

-- Índice para búsqueda de comentarios por ticket (ordenados por fecha)
CREATE INDEX "idx_comment_ticket_created" ON "Comment"("ticketId", "createdAt" DESC);

-- Índice para búsqueda de adjuntos por ticket
CREATE INDEX "idx_attachment_ticket" ON "Attachment"("ticketId", "createdAt" DESC);

-- Índice para búsqueda de auditoría por ticket (ordenado por fecha)
CREATE INDEX "idx_audit_ticket_occurred" ON "AuditTrail"("ticketId", "occurredAt" DESC);

-- Índice para búsqueda de auditoría por actor
CREATE INDEX "idx_audit_actor" ON "AuditTrail"("actorId", "occurredAt" DESC);

-- Índice GIN para búsqueda en tags de artículos
CREATE INDEX "idx_knowledge_tags" ON "KnowledgeArticle" USING GIN("tags");

-- Índice para búsqueda de artículos por área
CREATE INDEX "idx_knowledge_area" ON "KnowledgeArticle"("areaId")
WHERE "areaId" IS NOT NULL;

-- Índice para usuarios activos por área
CREATE INDEX "idx_user_area_active" ON "User"("areaId", "role")
WHERE "isActive" = true;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar automáticamente el campo updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updatedAt automáticamente
CREATE TRIGGER "update_area_updated_at"
    BEFORE UPDATE ON "Area"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_sla_updated_at"
    BEFORE UPDATE ON "SLA"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_user_updated_at"
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_ticket_updated_at"
    BEFORE UPDATE ON "Ticket"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_comment_updated_at"
    BEFORE UPDATE ON "Comment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_knowledge_updated_at"
    BEFORE UPDATE ON "KnowledgeArticle"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de tickets con información resumida
CREATE OR REPLACE VIEW "v_tickets_summary" AS
SELECT
    t."id",
    t."title",
    t."priority",
    t."status",
    t."createdAt",
    a."name" AS "areaName",
    r."name" AS "requesterName",
    r."email" AS "requesterEmail",
    asn."name" AS "assigneeName",
    asn."email" AS "assigneeEmail",
    CASE
        WHEN t."status" IN ('RESOLVED', 'CLOSED') THEN
            EXTRACT(EPOCH FROM (COALESCE(t."resolvedAt", t."closedAt") - t."createdAt")) / 60
        ELSE
            EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - t."createdAt")) / 60
    END AS "ageMinutes"
FROM "Ticket" t
INNER JOIN "Area" a ON t."areaId" = a."id"
INNER JOIN "User" r ON t."requesterId" = r."id"
LEFT JOIN "User" asn ON t."assignedToId" = asn."id";

COMMENT ON VIEW "v_tickets_summary" IS 'Vista resumida de tickets con información de área, requester y assignee';

-- Vista de SLAs por área
CREATE OR REPLACE VIEW "v_slas_by_area" AS
SELECT
    a."id" AS "areaId",
    a."name" AS "areaName",
    s."priority",
    s."responseTimeMinutes",
    s."resolutionTimeMinutes",
    s."isActive"
FROM "Area" a
LEFT JOIN "SLA" s ON a."id" = s."areaId"
ORDER BY a."name", s."priority";

COMMENT ON VIEW "v_slas_by_area" IS 'Vista de SLAs organizados por área y prioridad';

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - PARA DESARROLLO)
-- =====================================================

-- Descomentar para insertar datos de prueba
/*
-- Áreas de ejemplo
INSERT INTO "Area" ("id", "name", "description", "isActive") VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Tecnologías de la Información', 'Soporte técnico e infraestructura IT', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'Mantenimiento', 'Mantenimiento de instalaciones y equipos', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Administración', 'Gestión administrativa y recursos humanos', true);

-- Usuario administrador de ejemplo (password: admin123)
INSERT INTO "User" ("id", "name", "email", "role", "passwordHash", "isActive") VALUES
    ('880e8400-e29b-41d4-a716-446655440000',
     'Administrador del Sistema',
     'admin@hospital.com',
     'ADMIN',
     '$2b$10$rKvqEhPLnK9wQJYpNQJxV.L5vL5vL5vL5vL5vL5vL5vL5vL5vL5vL',
     true);

-- SLAs de ejemplo
INSERT INTO "SLA" ("areaId", "priority", "responseTimeMinutes", "resolutionTimeMinutes") VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'CRITICAL', 15, 120),
    ('550e8400-e29b-41d4-a716-446655440000', 'HIGH', 30, 240),
    ('550e8400-e29b-41d4-a716-446655440000', 'MEDIUM', 60, 480),
    ('550e8400-e29b-41d4-a716-446655440000', 'LOW', 120, 960);
*/

-- =====================================================
-- FIN DEL SCRIPT DDL
-- =====================================================

-- Para verificar la estructura creada:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT constraint_name, table_name, constraint_type FROM information_schema.table_constraints WHERE table_schema = 'public' ORDER BY table_name;
