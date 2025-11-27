import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
            <h1>Hospi-Desk</h1>
          </div>

          <div className="navbar-menu">
            <button className="nav-link" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>

            {(user?.role === UserRole.ADMIN || user?.role === UserRole.AGENT) && (
              <>
                <button className="nav-link" onClick={() => navigate('/areas')}>
                  Áreas
                </button>
                <button className="nav-link" onClick={() => navigate('/slas')}>
                  SLAs
                </button>
              </>
            )}

            {user?.role === UserRole.ADMIN && (
              <button className="nav-link" onClick={() => navigate('/users')}>
                Usuarios
              </button>
            )}

            <div className="user-menu">
              <div className="user-dropdown" ref={dropdownRef}>
                <div
                  className="user-info"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
                {showDropdown && (
                  <div className="dropdown-content">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                    >
                      👤 Mi Perfil
                    </button>
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Hospi-Desk. Sistema de Mesa de Servicios Hospitalario.</p>
      </footer>
    </div>
  );
};

export default Layout;
