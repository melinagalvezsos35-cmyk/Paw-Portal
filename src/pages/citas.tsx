import React, { useState, useEffect } from 'react';
import {
  Search,
  CalendarPlus,
  CheckCircle2,
  Clock,
  PawPrint,
  User,
  Phone,
  Stethoscope,
  CreditCard,
  IdCard,
  Calendar,
} from 'lucide-react';
import type { Appointment } from '../types';

export const CitasPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-10-26');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Partial<Appointment> | null>(null);

  // 1. Cargar citas desde MySQL
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/citas');
      if (response.ok) {
        const data = await response.json();
        const mappedAppointments: Appointment[] = data.map((row: any) => ({
          id: row.id.toString(),
          petName: row.mascota,
          ownerName: row.responsable,
          phone1: row.telefono_principal,
          phone2: row.telefono_secundario || '',
          ineVerified: Boolean(row.dejo_ine),
          serviceType: row.servicio,
          assignedEmployee: row.empleado_asignado,
          isPaid: Boolean(row.servicio_pagado),
          date: row.fecha ? row.fecha.split('T')[0] : '',
          time: row.hora,
          status: row.estado,
        }));
        setAppointments(mappedAppointments);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  // 2. Guardar nueva cita (POST) o actualizar existente (PUT) en MySQL
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const payload = {
      mascota: selectedApp.petName,
      responsable: selectedApp.ownerName,
      telefono_principal: selectedApp.phone1,
      telefono_secundario: selectedApp.phone2,
      fecha: selectedApp.date,
      hora: selectedApp.time,
      servicio: selectedApp.serviceType || 'Consulta General',
      empleado_asignado: selectedApp.assignedEmployee,
      dejo_ine: selectedApp.ineVerified,
      servicio_pagado: selectedApp.isPaid,
      estado: selectedApp.status || 'confirmada',
    };

    try {
      if (selectedApp.id) {
        const response = await fetch(`http://localhost:3000/api/citas/${selectedApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) fetchAppointments();
      } else {
        const response = await fetch('http://localhost:3000/api/citas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) fetchAppointments();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('No se pudo guardar la cita en el servidor.');
    }
  };

  // 3. Botón de "Confirmar Cita" en la columna derecha
  const handleConfirmAppointment = async (app: Appointment) => {
    const payload = {
      mascota: app.petName,
      responsable: app.ownerName,
      telefono_principal: app.phone1,
      telefono_secundario: app.phone2,
      fecha: app.date,
      hora: app.time,
      servicio: app.serviceType,
      empleado_asignado: app.assignedEmployee,
      dejo_ine: app.ineVerified,
      servicio_pagado: app.isPaid,
      estado: 'confirmada',
    };

    try {
      const response = await fetch(`http://localhost:3000/api/citas/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) fetchAppointments();
    } catch (error) {
      console.error('Error al confirmar cita:', error);
    }
  };

  return (
    <main className="page-container">
      <header className="page-header">
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
            />
            <input
              type="search"
              className="search-input"
              placeholder="Buscar en todas las citas (paciente, dueño...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem' }}
            />
          </div>

          <input
            type="date"
            className="search-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '165px' }}
            title="Filtrar citas del día"
          />
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <CalendarPlus size={18} />
          Registrar Nueva Cita
        </button>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* COLUMNA IZQUIERDA: CITAS CONFIRMADAS */}
        <article className="column-card" style={{ minHeight: '400px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={21} color="var(--primary, #0d7a68)" />
            Citas Confirmadas ({selectedDate})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
            {dayApps.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
                No hay citas confirmadas para esta fecha.
              </p>
            ) : (
              dayApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '0.95rem',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: '#effaf8',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onClick={() => handleOpenModal(app)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: '#0f172a' }}>
                      <PawPrint size={16} color="var(--primary, #0d7a68)" />
                      {app.petName}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontSize: '0.9rem' }}>
                      <Clock size={14} />
                      {app.time}
                    </span>
                  </div>

                  <p style={{ margin: '0.25rem 0', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                    <User size={14} color="#64748b" />
                    <strong>Responsable:</strong> {app.ownerName}
                  </p>

                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                    <Stethoscope size={14} color="#64748b" />
                    <strong>Servicio:</strong> {app.serviceType} ({app.assignedEmployee})
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(13, 122, 104, 0.12)' }}>
                    <span style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CreditCard size={14} color="#64748b" />
                      <strong>Pago:</strong>{' '}
                      <span style={{ color: app.isPaid ? '#166534' : 'var(--accent-strong)', fontWeight: 'bold' }}>
                        {app.isPaid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </span>

                    {app.ineVerified && (
                      <span
                        title="Identificación verificada"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.72rem',
                          background: '#dff5ef',
                          color: '#0d7a68',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                        }}
                      >
                        <IdCard size={12} />
                        INE OK
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        {/* COLUMNA DERECHA: SOLICITUDES POR CONFIRMAR */}
        <article className="column-card" style={{ minHeight: '400px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={21} color="var(--accent-strong, #b45309)" />
            Solicitudes Por Confirmar
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
            {pendingApps.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
                No hay citas pendientes por confirmar.
              </p>
            ) : (
              pendingApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '0.95rem',
                    border: '1px solid var(--accent)',
                    borderRadius: '10px',
                    background: 'var(--accent-soft)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: '#0f172a' }}>
                      <PawPrint size={16} color="var(--accent-strong, #b45309)" />
                      {app.petName}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-strong)', fontSize: '0.84rem' }}>
                      <Calendar size={14} />
                      {app.date}
                    </span>
                  </div>

                  <p style={{ margin: '0.25rem 0', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} color="#64748b" />
                    <strong>Responsable:</strong> {app.ownerName}
                  </p>

                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} color="#64748b" />
                    <strong>Teléfono:</strong> {app.phone1}
                  </p>

                  <button
                    className="btn-primary"
                    style={{ marginTop: '0.6rem', width: '100%' }}
                    onClick={() => handleConfirmAppointment(app)}
                  >
                    <CheckCircle2 size={16} />
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
              <CalendarPlus size={22} color="var(--primary, #0d7a68)" />
              {selectedApp.id ? 'Detalles de la Cita' : 'Registrar Nueva Cita'}
            </h2>

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

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Estado de la Cita *</label>
                <select
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={selectedApp.status || 'confirmada'}
                  onChange={(e) =>
                    setSelectedApp({ ...selectedApp, status: e.target.value as 'confirmada' | 'por_confirmar' })
                  }
                >
                  <option value="confirmada">Confirmada</option>
                  <option value="por_confirmar">Por Confirmar (Solicitud pendiente)</option>
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  background: '#effaf8',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
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
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};