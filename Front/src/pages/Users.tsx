import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { User, UserRole, Area } from '@/types';
import './Users.css';

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.REQUESTER,
    areaId: '',
    isActive: true,
  });
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const areasData = await apiService.getAreas();
      setAreas(areasData);

      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        areaId: user.areaId || '',
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: UserRole.REQUESTER,
        areaId: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user
        await apiService.updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          areaId: formData.areaId || undefined,
          isActive: formData.isActive,
        });
        toast.success('Usuario actualizado correctamente');
      } else {
        // Create user - need password
        const password = prompt('Ingrese una contraseña para el nuevo usuario (mínimo 6 caracteres):');
        if (!password || password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        await apiService.createUser({
          name: formData.name,
          email: formData.email,
          password,
          phone: formData.phone || undefined,
          role: formData.role,
          areaId: formData.areaId || undefined,
        });
        toast.success('Usuario creado correctamente');
      }

      await loadData();
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      await apiService.deleteUser(id);
      toast.success('Usuario eliminado correctamente');
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    const classes = {
      REQUESTER: 'badge-requester',
      AGENT: 'badge-agent',
      TECH: 'badge-tech',
      ADMIN: 'badge-admin',
    };
    return classes[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      REQUESTER: 'Solicitante',
      AGENT: 'Agente',
      TECH: 'Técnico',
      ADMIN: 'Administrador',
    };
    return labels[role];
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole && user.role !== filterRole) return false;
    if (filterActive === 'true' && !user.isActive) return false;
    if (filterActive === 'false' && user.isActive) return false;
    return true;
  });

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="users-subtitle">Administrar usuarios del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Nuevo Usuario
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-filters">
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value={UserRole.REQUESTER}>Solicitante</option>
          <option value={UserRole.AGENT}>Agente</option>
          <option value={UserRole.TECH}>Técnico</option>
          <option value={UserRole.ADMIN}>Administrador</option>
        </select>

        <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No hay usuarios registrados.</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name">{user.name}</div>
                    {user.phone && <div className="user-phone">{user.phone}</div>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>{user.area?.name || '-'}</td>
                  <td>
                    {user.isActive ? (
                      <span className="badge badge-active">Activo</span>
                    ) : (
                      <span className="badge badge-inactive">Inactivo</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenModal(user)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar"
                        disabled={user.id === currentUser?.id}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="usuario@hospital.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol *</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    required
                  >
                    <option value={UserRole.REQUESTER}>Solicitante</option>
                    <option value={UserRole.AGENT}>Agente</option>
                    <option value={UserRole.TECH}>Técnico</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="areaId">Área</label>
                <select
                  id="areaId"
                  value={formData.areaId}
                  onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                >
                  <option value="">Sin área asignada</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
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
                  Usuario activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
