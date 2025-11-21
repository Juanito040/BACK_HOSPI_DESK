

                                       JUAN MIGUEL RAMIREZ MANCILLA

* PARA CORRER EL PROYECTO: SOLO CONECTAR NUESTRA BD EN EL .ENV , Y CON npm run dev EJECUTAR EL PROYECTO. 

* NOTA IMPORTANTE : INSTALAR NODE , NPM INSTALL  !!



# Catálogo de Patrones de Diseño — Proyecto Hospi-Desk

Este documento describe los patrones de diseño y arquitectura aplicados en el proyecto **Hospi-Desk**, basado en **Domain-Driven Design (DDD)** y **Clean Architecture**.

---

##  1. Repository Pattern
**Ubicación:** `src/infrastructure/repositories/PrismaTicketRepository.ts`  
**Propósito:** Abstraer la lógica de persistencia de datos del dominio.  
**Ventaja:** Permite cambiar Prisma por otro ORM o fuente de datos sin afectar la lógica del dominio.  

**Ejemplo:**
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


