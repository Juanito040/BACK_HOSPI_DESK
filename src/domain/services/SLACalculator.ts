import { Ticket } from '../entities/Ticket';
import { SLA } from '../entities/SLA';

export interface SLAMetrics {
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  responseDeadline: Date;
  resolutionDeadline: Date;
  isResponseBreached: boolean;
  isResolutionBreached: boolean;
  responseBreachMinutes?: number;
  resolutionBreachMinutes?: number;
}

export class SLACalculator {
  calculateMetrics(ticket: Ticket, sla: SLA): SLAMetrics {
    const responseDeadline = sla.calculateResponseDeadline(ticket.createdAt);
    const resolutionDeadline = sla.calculateResolutionDeadline(ticket.createdAt);

    const responseTime = ticket.responseTime || new Date();
    const resolutionTime = ticket.resolutionTime || new Date();

    const isResponseBreached = sla.isResponseBreached(ticket.createdAt, ticket.responseTime);
    const isResolutionBreached = sla.isResolutionBreached(
      ticket.createdAt,
      ticket.resolutionTime
    );

    let responseBreachMinutes: number | undefined;
    if (isResponseBreached) {
      responseBreachMinutes =
        (responseTime.getTime() - responseDeadline.getTime()) / (1000 * 60);
    }

    let resolutionBreachMinutes: number | undefined;
    if (isResolutionBreached) {
      resolutionBreachMinutes =
        (resolutionTime.getTime() - resolutionDeadline.getTime()) / (1000 * 60);
    }

    const actualResponseTime = ticket.responseTime
      ? (ticket.responseTime.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
      : 0;

    const actualResolutionTime = ticket.resolutionTime
      ? (ticket.resolutionTime.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
      : 0;

    return {
      responseTimeMinutes: actualResponseTime,
      resolutionTimeMinutes: actualResolutionTime,
      responseDeadline,
      resolutionDeadline,
      isResponseBreached,
      isResolutionBreached,
      responseBreachMinutes,
      resolutionBreachMinutes,
    };
  }

  isTicketOverdue(ticket: Ticket, sla: SLA): boolean {
    if (ticket.status.isClosed()) {
      return false;
    }

    return sla.isResolutionBreached(ticket.createdAt);
  }

  getRemainingTime(ticket: Ticket, sla: SLA): number {
    if (ticket.status.isClosed()) {
      return 0;
    }

    const deadline = sla.calculateResolutionDeadline(ticket.createdAt);
    const now = new Date();
    const remainingMinutes = (deadline.getTime() - now.getTime()) / (1000 * 60);

    return Math.max(0, remainingMinutes);
  }

  getSLACompliancePercentage(tickets: Ticket[], sla: SLA): number {
    if (tickets.length === 0) return 100;

    const compliantTickets = tickets.filter(
      (ticket) => !sla.isResolutionBreached(ticket.createdAt, ticket.resolutionTime)
    );

    return (compliantTickets.length / tickets.length) * 100;
  }
}
