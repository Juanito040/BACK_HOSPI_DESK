import React from 'react';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import './DashboardStats.css';

interface DashboardStatsProps {
  tickets: Ticket[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tickets }) => {
  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((t) => t.status === status).length;
  };

  const getTicketsByPriority = (priority: TicketPriority) => {
    return tickets.filter((t) => t.priority === priority).length;
  };

  const getAverageResolutionTime = () => {
    const resolvedTickets = tickets.filter(
      (t) => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED
    );

    if (resolvedTickets.length === 0) return 'N/A';

    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      if (!ticket.resolutionTime) return sum;
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.resolutionTime).getTime();
      return sum + (resolved - created);
    }, 0);

    const avgMillis = totalTime / resolvedTickets.length;
    const avgHours = Math.round(avgMillis / (1000 * 60 * 60));

    return `${avgHours}h`;
  };

  const openTickets = getTicketsByStatus(TicketStatus.OPEN);
  const inProgressTickets = getTicketsByStatus(TicketStatus.IN_PROGRESS);
  const pendingTickets = getTicketsByStatus(TicketStatus.PENDING);
  const resolvedTickets = getTicketsByStatus(TicketStatus.RESOLVED);

  const criticalTickets = getTicketsByPriority(TicketPriority.CRITICAL);
  const highTickets = getTicketsByPriority(TicketPriority.HIGH);

  const urgentTickets = tickets.filter(
    (t) =>
      (t.priority === TicketPriority.CRITICAL || t.priority === TicketPriority.HIGH) &&
      t.status !== TicketStatus.RESOLVED &&
      t.status !== TicketStatus.CLOSED
  ).length;

  return (
    <div className="dashboard-stats">
      <div className="stat-card stat-primary">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-label">Total de Tickets</div>
          <div className="stat-value">{tickets.length}</div>
        </div>
      </div>

      <div className="stat-card stat-info">
        <div className="stat-icon">🆕</div>
        <div className="stat-content">
          <div className="stat-label">Abiertos</div>
          <div className="stat-value">{openTickets}</div>
        </div>
      </div>

      <div className="stat-card stat-warning">
        <div className="stat-icon">⚙️</div>
        <div className="stat-content">
          <div className="stat-label">En Progreso</div>
          <div className="stat-value">{inProgressTickets}</div>
        </div>
      </div>

      <div className="stat-card stat-pending">
        <div className="stat-icon">⏸️</div>
        <div className="stat-content">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value">{pendingTickets}</div>
        </div>
      </div>

      <div className="stat-card stat-success">
        <div className="stat-icon">✓</div>
        <div className="stat-content">
          <div className="stat-label">Resueltos</div>
          <div className="stat-value">{resolvedTickets}</div>
        </div>
      </div>

      <div className="stat-card stat-danger">
        <div className="stat-icon">🚨</div>
        <div className="stat-content">
          <div className="stat-label">Urgentes</div>
          <div className="stat-value">{urgentTickets}</div>
          <div className="stat-detail">
            {criticalTickets} críticos, {highTickets} altos
          </div>
        </div>
      </div>

      <div className="stat-card stat-time">
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <div className="stat-label">Tiempo Promedio</div>
          <div className="stat-value">{getAverageResolutionTime()}</div>
          <div className="stat-detail">de resolución</div>
        </div>
      </div>

      <div className="stat-card stat-rate">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <div className="stat-label">Tasa de Resolución</div>
          <div className="stat-value">
            {tickets.length > 0
              ? Math.round((resolvedTickets / tickets.length) * 100)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
