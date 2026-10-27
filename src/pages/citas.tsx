import React, { useState } from 'react';
import type { Appointment } from '../types';

const initialAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Max',
    ownerName: 'Laura Pérez',
    phone1: '9981234567',
    phone2: '9987654321',
    ineVerified: true,
    serviceType: 'Consulta General',
    assignedEmployee: 'Dr. Roberto Gómez',
    isPaid: true,
    date: '2026-10-26',
    time: '10:00 AM',
    status: 'confirmada',
  },
  {
    id: '2',
    petName: 'Luna',
    ownerName: 'Carlos Ruiz',
    phone1: '9981112233',
    phone2: '9982223344',
    ineVerified: false,
    serviceType: 'Vacunación',
    assignedEmployee: 'Dra. Ana Martínez',
    isPaid: false,
    date: '2026-10-26',
    time: '11:30 AM',
    status: 'por_confirmar',
  },
];

export const CitasPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState('2026-10-26');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Partial<Appointment> | null>(null);

  const searchedAppointments = appointments.filter(
    (app) =>
      app.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dayApps = searchedAppointments.filter(
    (app) => app.date === selectedDate && app.status === 'confirmada'
  );
  
  const pendingApps = searchedAppointments.filter(
    (app) => app.status === 'por_confirmar'
  );

  const handleOpenModal = (app?: Appointment) => {
    if (app) {
      setSelectedApp({ ...app });
    } else {
      setSelectedApp({
        petName: '',
        ownerName: '',
        phone1: '',
        phone2: '',
        ineVerified: false,
        serviceType: 'Consulta General',
        assignedEmployee: 'Dr. Roberto Gómez',
        isPaid: false,
        date: selectedDate,
        time: '10:00 AM',
        status: 'confirmada',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (selectedApp.id) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? (selectedApp as Appointment) : a))
      );
    } else {
      const newApp = { ...(selectedApp as Appointment), id: Date.now().toString() };
      setAppointments((prev) => [...prev, newApp]);
    }
    setIsModalOpen(false);
  };

  return (
    <main className="page-container">
      <header className="page-header">
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="search"
            className="search-input"
            placeholder="Buscar en todas las citas (paciente, dueño...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '260px' }}
          />
          <input
            type="date"
            className="search-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '160px' }}
            title="Filtrar citas del día"
          />
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Registrar Nueva Cita</button>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        <article className="column-card" style={{ minHeight: '400px' }}>
          <h2>Citas Confirmadas ({selectedDate})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
            {dayApps.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>No hay citas confirmadas para esta fecha.</p>
            ) : (
              dayApps.map((app) => (
                <div
                  key={app.id}
                  style={{ padding: '0.9rem', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: '#effaf8' }}
                  onClick={() => handleOpenModal(app)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{app.petName}</span>
                    <span style={{ color: 'var(--primary)' }}>{app.time}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}><strong>Responsable:</strong> {app.ownerName}</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}><strong>Servicio:</strong> {app.serviceType} ({app.assignedEmployee})</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>
                    <strong>Pago:</strong>{' '}
                    <span style={{ color: app.isPaid ? '#166534' : 'var(--accent-strong)', fontWeight: 'bold' }}>
                      {app.isPaid ? 'Pagado' : 'Pendiente'}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="column-card" style={{ minHeight: '400px' }}>
          <h2>Solicitudes Por Confirmar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
            {pendingApps.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>No hay citas pendientes por confirmar.</p>
            ) : (
              pendingApps.map((app) => (
                <div key={app.id} style={{ padding: '0.9rem', border: '1px solid var(--accent)', borderRadius: '8px', background: 'var(--accent-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{app.petName}</span>
                    <span style={{ color: 'var(--accent-strong)', fontSize: '0.85rem' }}>Fecha: {app.date}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}><strong>Responsable:</strong> {app.ownerName}</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}><strong>Teléfono:</strong> {app.phone1}</p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                    onClick={() =>
                      setAppointments((prev) =>
                        prev.map((a) => (a.id === app.id ? { ...a, status: 'confirmada' } : a))
                      )
                    }
                  >
                    Confirmar Cita
                  </button>
                </div>
              ))
            )}
          </div>
        </article>

      </section>

      {isModalOpen && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedApp.id ? 'Detalles de la Cita' : 'Registrar Nueva Cita'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre del Paciente (Mascota) *</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="Ej. Rocky"
                  value={selectedApp.petName || ''}
                  onChange={(e) => setSelectedApp({ ...selectedApp, petName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre del Responsable (Dueño) *</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="Ej. María López"
                  value={selectedApp.ownerName || ''}
                  onChange={(e) => setSelectedApp({ ...selectedApp, ownerName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Teléfono Principal *</label>
                  <input
                    type="tel"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="9981234567"
                    value={selectedApp.phone1 || ''}
                    onChange={(e) => setSelectedApp({ ...selectedApp, phone1: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Teléfono Secundario</label>
                  <input
                    type="tel"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="Opcional"
                    value={selectedApp.phone2 || ''}
                    onChange={(e) => setSelectedApp({ ...selectedApp, phone2: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Fecha *</label>
                  <input
                    type="date"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={selectedApp.date || selectedDate}
                    onChange={(e) => setSelectedApp({ ...selectedApp, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hora *</label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="10:00 AM"
                    value={selectedApp.time || ''}
                    onChange={(e) => setSelectedApp({ ...selectedApp, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Empleado Asignado *</label>
                <select
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={selectedApp.assignedEmployee || 'Dr. Roberto Gómez'}
                  onChange={(e) => setSelectedApp({ ...selectedApp, assignedEmployee: e.target.value })}
                >
                  <option value="Dr. Roberto Gómez">Dr. Roberto Gómez (Veterinario)</option>
                  <option value="Dra. Ana Martínez">Dra. Ana Martínez (Cirujana)</option>
                  <option value="Carlos López">Carlos López (Estilista)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#effaf8', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.ineVerified || false}
                    onChange={(e) => setSelectedApp({ ...selectedApp, ineVerified: e.target.checked })}
                  />
                  <strong>¿Dejó identificación (INE)?</strong> (Regla anti-abandono)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.isPaid || false}
                    onChange={(e) => setSelectedApp({ ...selectedApp, isPaid: e.target.checked })}
                  />
                  <strong>¿Servicio pagado?</strong>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cita</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};