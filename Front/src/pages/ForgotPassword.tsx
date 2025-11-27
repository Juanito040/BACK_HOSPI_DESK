import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al solicitar el restablecimiento');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Hospi-Desk</h1>
          <h2 className="auth-subtitle">Correo Enviado</h2>

          <div className="success-message">
            Se ha enviado un correo con las instrucciones para restablecer tu contraseña.
            Por favor revisa tu bandeja de entrada.
          </div>

          <Link to="/login" className="btn btn-primary">
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Hospi-Desk</h1>
        <h2 className="auth-subtitle">Recuperar Contraseña</h2>

        <p className="auth-description">
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu
          contraseña.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
        </form>

        <p className="auth-link">
          ¿Recordaste tu contraseña? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
