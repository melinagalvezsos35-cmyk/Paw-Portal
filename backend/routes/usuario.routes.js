const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/usuarios (Registro)
router.post('/usuarios', async (req, res) => {
  const { nombre, email, password_hash, rol } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password_hash, rol || 'veterinario']
    );
    res.status(201).json({ id: result.insertId, nombre, email, rol });
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    res.status(500).json({ error: 'Error al guardar el usuario en la base de datos' });
  }
});

// POST /api/login (Inicio de sesión)
router.post('/login', async (req, res) => {
  const { email, password_hash } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol FROM Usuarios WHERE email = ? AND password_hash = ?',
      [email, password_hash]
    );
    if (rows.length > 0) {
      res.json({ mensaje: 'Login exitoso', usuario: rows[0] });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;