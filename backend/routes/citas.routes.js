const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/citas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Citas ORDER BY fecha ASC, hora ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// POST /api/citas
router.post('/', async (req, res) => {
  const {
    mascota,
    responsable,
    telefono_principal,
    telefono_secundario,
    fecha,
    hora,
    servicio,
    empleado_asignado,
    dejo_ine,
    servicio_pagado,
    estado,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO Citas 
      (mascota, responsable, telefono_principal, telefono_secundario, fecha, hora, servicio, empleado_asignado, dejo_ine, servicio_pagado, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mascota,
        responsable,
        telefono_principal,
        telefono_secundario || null,
        fecha,
        hora,
        servicio,
        empleado_asignado,
        dejo_ine ? 1 : 0,
        servicio_pagado ? 1 : 0,
        estado || 'confirmada',
      ]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Cita creada correctamente' });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ error: 'Error al guardar la cita' });
  }
});

// PUT /api/citas/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    mascota,
    responsable,
    telefono_principal,
    telefono_secundario,
    fecha,
    hora,
    servicio,
    empleado_asignado,
    dejo_ine,
    servicio_pagado,
    estado,
  } = req.body;

  try {
    await pool.query(
      `UPDATE Citas SET 
      mascota = ?, responsable = ?, telefono_principal = ?, telefono_secundario = ?, 
      fecha = ?, hora = ?, servicio = ?, empleado_asignado = ?, 
      dejo_ine = ?, servicio_pagado = ?, estado = ? 
      WHERE id = ?`,
      [
        mascota,
        responsable,
        telefono_principal,
        telefono_secundario || null,
        fecha,
        hora,
        servicio,
        empleado_asignado,
        dejo_ine ? 1 : 0,
        servicio_pagado ? 1 : 0,
        estado,
        id,
      ]
    );
    res.json({ mensaje: 'Cita actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
});

module.exports = router;