import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  UserRole,
  Comment,
  Attachment,
} from '@/types';
import './TicketDetail.css';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id]);

  const loadTicket = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const data = await apiService.getTicketById(id);
      // Backend returns { ticket, comments, attachments }
      const ticketData = data.ticket || data;
      setTicket(ticketData);
      setNewStatus(ticketData.status);
      setResolution(ticketData.resolution || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id || !newStatus) return;

    try {
      await apiService.updateTicketStatus(id, {
        status: newStatus as TicketStatus,
        resolution: resolution || undefined,
      });
      await loadTicket();
      alert('Estado actualizado correctamente');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const canUpdateStatus = () => {
    return (
      user?.role === UserRole.ADMIN ||
      user?.role === UserRole.AGENT ||
      user?.role === UserRole.TECH ||
      ticket?.assignedToId === user?.id
    );
  };

  if (loading) {
    return <div className="loading">Cargando ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Ticket no encontrado'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Volver
      </button>

      <div className="ticket-header">
        <div>
          <h1>{ticket.title}</h1>
          <div className="ticket-meta">
            <span className="badge badge-priority" style={{ backgroundColor: '#667eea' }}>
              {ticket.priority}
            </span>
            <span className="badge badge-status" style={{ backgroundColor: '#17a2b8' }}>
              {ticket.status.replace('_', ' ')}
            </span>
            {ticket.area && <span className="area-badge">{ticket.area.name}</span>}
          </div>
        </div>
      </div>

      <div className="ticket-content">
        <div className="ticket-main">
          <div className="section">
            <h2>Descripción</h2>
            <p>{ticket.description}</p>
          </div>

          <div className="section">
            <h3>Información</h3>
            <div className="info-grid">
              <div>
                <strong>Solicitante:</strong> {ticket.requester.name}
              </div>
              <div>
                <strong>Email:</strong> {ticket.requester.email}
              </div>
              {ticket.assignedTo && (
                <div>
                  <strong>Asignado a:</strong> {ticket.assignedTo.name}
                </div>
              )}
              <div>
                <strong>Creado:</strong> {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          {canUpdateStatus() && (
            <div className="section">
              <h3>Actualizar Estado</h3>
              <div className="status-form">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                >
                  <option value={TicketStatus.OPEN}>Abierto</option>
                  <option value={TicketStatus.IN_PROGRESS}>En Progreso</option>
                  <option value={TicketStatus.PENDING}>Pendiente</option>
                  <option value={TicketStatus.RESOLVED}>Resuelto</option>
                  <option value={TicketStatus.CLOSED}>Cerrado</option>
                </select>

                {(newStatus === TicketStatus.RESOLVED || newStatus === TicketStatus.CLOSED) && (
                  <textarea
                    placeholder="Resolución..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={3}
                  />
                )}

                <button onClick={handleUpdateStatus} className="btn btn-primary">
                  Actualizar Estado
                </button>
              </div>
            </div>
          )}

          {ticket.comments && ticket.comments.length > 0 && (
            <div className="section">
              <h3>Comentarios</h3>
              <div className="comments-list">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`comment ${comment.isInternal ? 'comment-internal' : ''}`}
                  >
                    <div className="comment-header">
                      <strong>{comment.user.name}</strong>
                      {comment.isInternal && (
                        <span className="badge badge-internal">Interno</span>
                      )}
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="ticket-sidebar">
            <div className="section">
              <h3>Archivos Adjuntos</h3>
              <div className="attachments-list">
                {ticket.attachments.map((attachment) => (
                  <div key={attachment.id} className="attachment-item">
                    <div className="attachment-info">
                      <strong>{attachment.fileName}</strong>
                      <small>{formatFileSize(attachment.fileSize)}</small>
                    </div>
                    <div className="attachment-actions">
                      <a
                        href={apiService.getAttachmentDownloadUrl(attachment.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="Descargar"
                      >
                        ⬇
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
