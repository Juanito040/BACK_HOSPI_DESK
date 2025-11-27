import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { TicketPriority, Area } from '@/types';
import './NewTicket.css';

const NewTicket: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const data = await apiService.getAreas(true);
      setAreas(data || []);
    } catch (err) {
      console.error('Error loading areas:', err);
      setAreas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ticketData = {
      title,
      description,
      priority,
      areaId: areaId || undefined,
    };

    try {
      const ticket = await apiService.createTicket(ticketData);
      navigate(`/tickets/${ticket.id}`);
    } catch (err: any) {
      console.error('Error creating ticket:', err);

      // Format validation errors
      if (err.response?.data?.details) {
        const validationErrors = err.response.data.details
          .map((detail: any) => {
            const field = detail.property;
            const messages = Object.values(detail.constraints || {});
            return `${field}: ${messages.join(', ')}`;
          })
          .join('\n');
        setError(`Errores de validación:\n${validationErrors}`);
      } else {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Error al crear el ticket'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Volver
      </button>

      <div className="new-ticket-card">
        <h1>Crear Nuevo Ticket</h1>

        <form onSubmit={handleSubmit} className="ticket-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              placeholder="Ej: Problema con el sistema de facturación"
            />
            <small className="help-text">Mínimo 3 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={5}
              placeholder="Describe el problema o solicitud en detalle..."
              rows={6}
            />
            <small className="help-text">Mínimo 5 caracteres</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Prioridad *</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                required
              >
                <option value={TicketPriority.LOW}>Baja</option>
                <option value={TicketPriority.MEDIUM}>Media</option>
                <option value={TicketPriority.HIGH}>Alta</option>
                <option value={TicketPriority.CRITICAL}>Crítica</option>
              </select>
              <small className="help-text">
                {priority === TicketPriority.LOW && 'Sin impacto en operaciones'}
                {priority === TicketPriority.MEDIUM && 'Impacto moderado'}
                {priority === TicketPriority.HIGH && 'Impacto significativo'}
                {priority === TicketPriority.CRITICAL && 'Impacto crítico - requiere atención inmediata'}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="area">Área</label>
              <select
                id="area"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
              >
                <option value="">Sin asignar</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
