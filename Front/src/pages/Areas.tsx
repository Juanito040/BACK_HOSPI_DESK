import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Area, UserRole } from '@/types';
import './Areas.css';

const Areas: React.FC = () => {
  const { user } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiService.getAreas();
      setAreas(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las áreas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        name: area.name,
        description: area.description || '',
        isActive: area.isActive,
      });
    } else {
      setEditingArea(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArea(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingArea) {
        await apiService.updateArea(editingArea.id, formData);
      } else {
        await apiService.createArea(formData);
      }
      await loadAreas();
      handleCloseModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el área');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta área?')) return;

    try {
      await apiService.deleteArea(id);
      await loadAreas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el área');
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  if (loading) {
    return <div className="loading">Cargando áreas...</div>;
  }

  return (
    <div className="areas-page">
      <div className="areas-header">
        <h1>Gestión de Áreas</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Nueva Área
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="areas-grid">
        {areas.length === 0 ? (
          <div className="no-areas">No hay áreas registradas.</div>
        ) : (
          areas.map((area) => (
            <div key={area.id} className="area-card">
              <div className="area-header">
                <h3>{area.name}</h3>
                {area.isActive ? (
                  <span className="badge badge-active">Activa</span>
                ) : (
                  <span className="badge badge-inactive">Inactiva</span>
                )}
              </div>

              {area.description && (
                <p className="area-description">{area.description}</p>
              )}

              <div className="area-footer">
                <small>Creada: {new Date(area.createdAt).toLocaleDateString('es-CO')}</small>
                {isAdmin && (
                  <div className="area-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenModal(area)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(area.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingArea ? 'Editar Área' : 'Nueva Área'}</h2>

            <form onSubmit={handleSubmit} className="area-form">
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Sistemas, Soporte Técnico"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción del área..."
                  rows={4}
                />
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
                  Área activa
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingArea ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Areas;
