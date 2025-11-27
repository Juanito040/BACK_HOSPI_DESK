import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Actualización de perfil no implementada - requiere endpoint en backend');
    setEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    toast.info('Cambio de contraseña no implementado - requiere endpoint en backend');
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      REQUESTER: 'Solicitante',
      AGENT: 'Agente',
      TECH: 'Técnico',
      ADMIN: 'Administrador',
    };
    return labels[role] || role;
  };

  if (!user) {
    return (
      <div className="loading">Cargando perfil...</div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="profile-role">{getRoleLabel(user.role)}</p>
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="detail-item">
                <label>Correo Electrónico</label>
                <p>{user.email}</p>
              </div>

              {user.phone && (
                <div className="detail-item">
                  <label>Teléfono</label>
                  <p>{user.phone}</p>
                </div>
              )}

              {user.area && (
                <div className="detail-item">
                  <label>Área</label>
                  <p>{user.area.name}</p>
                </div>
              )}

              <div className="detail-item">
                <label>Estado</label>
                <p>{user.isActive ? 'Activo' : 'Inactivo'}</p>
              </div>

              <div className="profile-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? 'Cancelar Cambio de Contraseña' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {showPasswordForm && !editing && (
            <div className="password-form-container">
              <h3>Cambiar Contraseña</h3>
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Cambiar Contraseña
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
