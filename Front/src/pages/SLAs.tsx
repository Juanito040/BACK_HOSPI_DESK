import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { SLA, Area, TicketPriority, UserRole } from '@/types';
import './SLAs.css';

const SLAs: React.FC = () => {
  const { user } = useAuth();
  const [slas, setSlas] = useState<SLA[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSLA, setEditingSLA] = useState<SLA | null>(null);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('');
  const [formData, setFormData] = useState({
    areaId: '',
    priority: TicketPriority.MEDIUM,
    responseTimeMinutes: 60,
    resolutionTimeMinutes: 480,
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, [selectedAreaFilter]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [slasData, areasData] = await Promise.all([
        apiService.getSLAs(selectedAreaFilter || undefined),
        apiService.getAreas(true),
      ]);
      setSlas(slasData);
      setAreas(areasData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los SLAs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sla?: SLA) => {
    if (sla) {
      setEditingSLA(sla);
      setFormData({
        areaId: sla.areaId,
        priority: sla.priority,
        responseTimeMinutes: sla.responseTimeMinutes,
        resolutionTimeMinutes: sla.resolutionTimeMinutes,
        isActive: sla.isActive,
      });
    } else {
      setEditingSLA(null);
      setFormData({
        areaId: '',
        priority: TicketPriority.MEDIUM,
        responseTimeMinutes: 60,
        resolutionTimeMinutes: 480,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSLA(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSLA) {
        await apiService.updateSLA(editingSLA.id, formData);
      } else {
        await apiService.createSLA(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el SLA');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este SLA?')) return;

    try {
      await apiService.deleteSLA(id);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el SLA');
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
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

  const getPriorityLabel = (priority: TicketPriority) => {
    const labels = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    };
    return labels[priority];
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  if (loading) {
    return <div className="loading">Cargando SLAs...</div>;
  }

  return (
    <div className="slas-page">
      <div className="slas-header">
        <div>
          <h1>Gestión de SLAs</h1>
          <p className="slas-subtitle">
            Acuerdos de Nivel de Servicio por Área y Prioridad
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Nuevo SLA
          </button>
        )}
      </div>

      <div className="slas-filters">
        <select
          value={selectedAreaFilter}
          onChange={(e) => setSelectedAreaFilter(e.target.value)}
          className="area-filter"
        >
          <option value="">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="slas-grid">
        {slas.length === 0 ? (
          <div className="no-slas">
            No hay SLAs configurados{selectedAreaFilter ? ' para esta área' : ''}.
          </div>
        ) : (
          slas.map((sla) => (
            <div key={sla.id} className="sla-card">
              <div className="sla-header">
                <div>
                  <h3>{sla.area.name}</h3>
                  <span
                    className="badge"
                    style={{ backgroundColor: getPriorityColor(sla.priority) }}
                  >
                    {getPriorityLabel(sla.priority)}
                  </span>
                </div>
                {sla.isActive ? (
                  <span className="badge badge-active">Activo</span>
                ) : (
                  <span className="badge badge-inactive">Inactivo</span>
                )}
              </div>

              <div className="sla-times">
                <div className="sla-time-item">
                  <div className="sla-time-label">Tiempo de Respuesta</div>
                  <div className="sla-time-value">
                    {formatTime(sla.responseTimeMinutes)}
                  </div>
                </div>
                <div className="sla-time-divider"></div>
                <div className="sla-time-item">
                  <div className="sla-time-label">Tiempo de Resolución</div>
                  <div className="sla-time-value">
                    {formatTime(sla.resolutionTimeMinutes)}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="sla-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleOpenModal(sla)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(sla.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSLA ? 'Editar SLA' : 'Nuevo SLA'}</h2>

            <form onSubmit={handleSubmit} className="sla-form">
              <div className="form-group">
                <label htmlFor="areaId">Área *</label>
                <select
                  id="areaId"
                  value={formData.areaId}
                  onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                  required
                  disabled={!!editingSLA}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {editingSLA && (
                  <small className="help-text">No se puede cambiar el área de un SLA existente</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="priority">Prioridad *</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as TicketPriority })
                  }
                  required
                  disabled={!!editingSLA}
                >
                  <option value={TicketPriority.LOW}>Baja</option>
                  <option value={TicketPriority.MEDIUM}>Media</option>
                  <option value={TicketPriority.HIGH}>Alta</option>
                  <option value={TicketPriority.CRITICAL}>Crítica</option>
                </select>
                {editingSLA && (
                  <small className="help-text">No se puede cambiar la prioridad de un SLA existente</small>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="responseTime">Tiempo de Respuesta (minutos) *</label>
                  <input
                    id="responseTime"
                    type="number"
                    min="1"
                    value={formData.responseTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responseTimeMinutes: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                  <small className="help-text">{formatTime(formData.responseTimeMinutes)}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="resolutionTime">Tiempo de Resolución (minutos) *</label>
                  <input
                    id="resolutionTime"
                    type="number"
                    min="1"
                    value={formData.resolutionTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resolutionTimeMinutes: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                  <small className="help-text">{formatTime(formData.resolutionTimeMinutes)}</small>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  SLA activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSLA ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLAs;
