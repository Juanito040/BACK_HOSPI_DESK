import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { User, UserRole } from '@/types';
import './AssignTicketModal.css';

interface AssignTicketModalProps {
  ticketId: string;
  currentAssigneeId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  ticketId,
  currentAssigneeId,
  onClose,
  onSuccess,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(currentAssigneeId || '');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // En un escenario real, necesitarías un endpoint para obtener usuarios
      // Por ahora, esto es un placeholder
      setLoading(false);
    } catch (err: any) {
      setError('Error al cargar usuarios');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError('Debe seleccionar un usuario');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiService.assignTicket(ticketId, { assignedToId: selectedUserId });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async () => {
    if (!confirm('¿Está seguro de desasignar este ticket?')) return;

    setSubmitting(true);
    setError('');

    try {
      // Asignar a un usuario vacío para desasignar
      await apiService.assignTicket(ticketId, { assignedToId: '' });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al desasignar ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content assign-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Asignar Ticket</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="assign-form">
          <div className="form-group">
            <label htmlFor="assignee">Asignar a</label>
            <input
              id="assignee"
              type="text"
              placeholder="ID del usuario (ej: usuario@hospital.com)"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            />
            <small className="help-text">
              Ingrese el ID del agente o técnico al que desea asignar este ticket
            </small>
          </div>

          <div className="modal-actions">
            {currentAssigneeId && (
              <button
                type="button"
                onClick={handleUnassign}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Desasignar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTicketModal;
