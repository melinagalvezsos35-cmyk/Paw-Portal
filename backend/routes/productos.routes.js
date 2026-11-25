const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Productos ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /api/productos
router.post('/', async (req, res) => {
  const { nombre, categoria, precio_venta, stock } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Productos (nombre, categoria, precio_venta, stock) VALUES (?, ?, ?, ?)',
      [nombre, categoria, precio_venta, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, categoria, precio_venta, stock });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
});

// PUT /api/productos/:id/stock
router.put('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    await pool.query('UPDATE Productos SET stock = ? WHERE id = ?', [stock, id]);
    res.json({ mensaje: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar el stock' });
  }
});

module.exports = router;