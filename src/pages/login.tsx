import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 style={{ textAlign: 'center', margin: '0 0 0.5rem 0' }}>Paw Portal</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="user-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Usuario</label>
            <input
              id="user-input"
              type="text"
              className="search-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="pass-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contraseña</label>
            <input
              id="pass-input"
              type="password"
              className="search-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center' }}>Ingresa usuario y contraseña válidos.</p>}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};