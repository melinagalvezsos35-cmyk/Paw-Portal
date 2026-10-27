import { useState } from 'react';
import type { PageView } from './types';
import { Navbar } from './components/navbar';
import { LoginPage } from './pages/login';
import { CitasPage } from './pages/citas';
import { VentasPage } from './pages/ventas';
import { InventarioPage } from './pages/inventario';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('login');

  const handleLogout = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={() => setCurrentPage('citas')} />;
  }

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={handleLogout}
      />
      {currentPage === 'citas' && <CitasPage />}
      {currentPage === 'ventas' && <VentasPage />}
      {currentPage === 'inventario' && <InventarioPage />}
    </div>
  );
}

export default App;