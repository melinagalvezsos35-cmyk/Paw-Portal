import React from 'react';
import type { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        Paw Portal
      </div>

      <div className="navbar-menu">

        <button
          className={`nav-btn ${currentPage === 'citas' ? 'active' : ''}`}
          onClick={() => onNavigate('citas')}
        >
          Citas
        </button>

        <button
          className={`nav-btn ${currentPage === 'ventas' ? 'active' : ''}`}
          onClick={() => onNavigate('ventas')}
        >
          Ventas
        </button>

        <button
            className={`nav-btn ${currentPage === 'inventario' ? 'active' : ''}`}
            onClick={() => onNavigate('inventario')}
        >
        Inventario
        </button>

        <button className="nav-btn btn-logout" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};