import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { UserRole, Area } from '@/types';
import './Auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.REQUESTER);
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      console.log('[Register] Loading areas...');
      const data = await apiService.getAreas(true);
      console.log('[Register] Areas loaded:', data);
      setAreas(data);
    } catch (err) {
      console.error('[Register] Error loading areas:', err);
      // Don't throw error, just log it - areas are optional for registration
      setAreas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to register:', { name, email, role });
      await register({
        name,
        email,
        phone: phone || undefined,
        password,
        role,
        areaId: areaId || undefined,
      });
      console.log('Registration successful');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          err.message ||
                          'Error al registrarse. Por favor intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Hospi-Desk</h1>
        <h2 className="auth-subtitle">Registro</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@hospital.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono (opcional)</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
            >
              <option value={UserRole.REQUESTER}>Solicitante</option>
              <option value={UserRole.AGENT}>Agente</option>
              <option value={UserRole.TECH}>Técnico</option>
              <option value={UserRole.ADMIN}>Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="area">Área (opcional)</label>
            <select
              id="area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="">Seleccione un área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
