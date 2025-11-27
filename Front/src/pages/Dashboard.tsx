import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, TicketStatus, TicketPriority, TicketFilters } from '@/types';
import DashboardStats from '@/components/DashboardStats';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadTickets();
    loadAllTicketsForStats();
  }, [filters]);

  const loadTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.getTickets(filters);
      setTickets(response.data);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('Error loading tickets:', err);
      setError(err.response?.data?.message || 'Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTicketsForStats = async () => {
    try {
      const response = await apiService.getTickets({ pageSize: 1000 });
      setAllTickets(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      searchText: searchText || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  const getPriorityColor = (priority: TicketPriority) => {
    const colors = {
      LOW: '#28a745',
      MEDIUM: '#ffc107',
      HIGH: '#fd7e14',
      CRITICAL: '#dc3545',
    };
    return colors[priority];
  };

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      OPEN: '#007bff',
      IN_PROGRESS: '#17a2b8',
      PENDING: '#ffc107',
      RESOLVED: '#28a745',
      CLOSED: '#6c757d',
    };
    return colors[status];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/tickets/new')}
        >
          + Nuevo Ticket
        </button>
      </div>

      {allTickets.length > 0 && <DashboardStats tickets={allTickets} />}

      <h2 className="tickets-title">Tickets</h2>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            Buscar
          </button>
        </div>

        <div className="filters">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value={TicketStatus.OPEN}>Abierto</option>
            <option value={TicketStatus.IN_PROGRESS}>En Progreso</option>
            <option value={TicketStatus.PENDING}>Pendiente</option>
            <option value={TicketStatus.RESOLVED}>Resuelto</option>
            <option value={TicketStatus.CLOSED}>Cerrado</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">Todas las prioridades</option>
            <option value={TicketPriority.LOW}>Baja</option>
            <option value={TicketPriority.MEDIUM}>Media</option>
            <option value={TicketPriority.HIGH}>Alta</option>
            <option value={TicketPriority.CRITICAL}>Crítica</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Cargando tickets...</div>
      ) : (
        <>
          <div className="tickets-grid">
            {tickets.length === 0 ? (
              <div className="no-tickets">
                No se encontraron tickets con los filtros seleccionados.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-card"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="ticket-header">
                    <h3>{ticket.title}</h3>
                    <div className="ticket-badges">
                      <span
                        className="badge"
                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className="badge"
                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="ticket-description">{ticket.description}</p>

                  <div className="ticket-footer">
                    <div className="ticket-info">
                      <small>Solicitante: {ticket.requester.name}</small>
                      {ticket.assignedTo && (
                        <small>Asignado a: {ticket.assignedTo.name}</small>
                      )}
                    </div>
                    <small className="ticket-date">
                      {formatDate(ticket.createdAt)}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                disabled={filters.page === 1}
                className="btn btn-secondary"
              >
                Anterior
              </button>
              <span>
                Página {filters.page} de {totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                disabled={filters.page === totalPages}
                className="btn btn-secondary"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
