import React from 'react';
import { PawPrint, CalendarDays, ShoppingBag, Boxes, LogOut } from 'lucide-react';
import type { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div
        className="navbar-brand"
        onClick={() => onNavigate('citas')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        <PawPrint size={24} />
        <span>Paw Portal</span>
      </div>

      <div className="navbar-menu">
        <button
          className={`nav-btn ${currentPage === 'citas' ? 'active' : ''}`}
          onClick={() => onNavigate('citas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <CalendarDays size={17} />
          Citas
        </button>

        <button
          className={`nav-btn ${currentPage === 'ventas' ? 'active' : ''}`}
          onClick={() => onNavigate('ventas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ShoppingBag size={17} />
          Ventas
        </button>

        <button
          className={`nav-btn ${currentPage === 'inventario' ? 'active' : ''}`}
          onClick={() => onNavigate('inventario')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Boxes size={17} />
          Inventario
        </button>

        <button
          className="nav-btn btn-logout"
          onClick={onLogout}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <LogOut size={17} />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};