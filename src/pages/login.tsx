import React, { useState } from 'react';
import { PawPrint, Mail, Lock, User, ShieldCheck, LogIn, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('veterinario');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setMensaje('');
    setIsError(false);
    setNombre('');
    setRol('veterinario');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setIsError(false);

    if (!email.trim() || !password.trim() || (isRegisterMode && !nombre.trim())) {
      setIsError(true);
      setMensaje('Por favor, llena todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const response = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            email,
            password_hash: password,
            rol,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsError(false);
          setMensaje('¡Cuenta creada! Ahora puedes iniciar sesión.');
          setTimeout(() => {
            setIsRegisterMode(false);
            setMensaje('');
            setPassword('');
          }, 1500);
        } else {
          setIsError(true);
          setMensaje(data.error || 'Error al registrar usuario.');
        }
      } else {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password_hash: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const userData = data.usuario || { nombre: email.split('@')[0], rol: 'Administrador' };
          localStorage.setItem('paw_user', JSON.stringify(userData));
          onLoginSuccess();
        } else {
          setIsError(true);
          setMensaje('Correo o contraseña incorrectos.');
        }
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setIsError(true);
      setMensaje('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <div
            style={{
              background: '#dff5ef',
              color: 'var(--primary, #0d7a68)',
              padding: '0.75rem',
              borderRadius: '14px',
              display: 'inline-flex',
            }}
          >
            <PawPrint size={30} />
          </div>
        </div>

        <h1 style={{ textAlign: 'center', margin: '0 0 0.35rem 0' }}>
          {isRegisterMode ? 'Crear Cuenta' : 'Paw Portal'}
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.4rem 0' }}>
          {isRegisterMode ? 'Registra un nuevo usuario en el sistema' : 'Inicia sesión para gestionar la clínica'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegisterMode && (
            <>
              <div>
                <label htmlFor="nombre-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Nombre Completo
                </label>
                <div style={{ position: 'relative', marginTop: '0.3rem' }}>
                  <User
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                  />
                  <input
                    id="nombre-input"
                    type="text"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.3rem' }}
                    placeholder="Ej. Melina Gálvez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rol-select" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Rol en la Clínica
                </label>
                <div style={{ position: 'relative', marginTop: '0.3rem' }}>
                  <ShieldCheck
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                  />
                  <select
                    id="rol-select"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.3rem' }}
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="administrador">Administrador</option>
                    <option value="veterinario">Veterinario</option>
                    <option value="recepcionista">Recepcionista</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative', marginTop: '0.3rem' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                id="email-input"
                type="email"
                className="search-input"
                style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.3rem' }}
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="pass-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Contraseña
            </label>
            <div style={{ position: 'relative', marginTop: '0.3rem' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                id="pass-input"
                type="password"
                className="search-input"
                style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.3rem' }}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {mensaje && (
            <p style={{ color: isError ? '#dc2626' : '#166534', fontSize: '0.85rem', textAlign: 'center', margin: 0, fontWeight: 500 }}>
              {mensaje}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.7rem' }} disabled={isLoading}>
            {isRegisterMode ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isLoading ? 'Procesando...' : isRegisterMode ? 'Registrar Usuario' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <button
            type="button"
            onClick={handleToggleMode}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary, #0d7a68)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};