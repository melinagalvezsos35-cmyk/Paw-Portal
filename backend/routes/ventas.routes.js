const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/ventas
router.post('/', async (req, res) => {
  const { total, metodo_pago, productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [ventaResult] = await connection.query(
      'INSERT INTO Ventas (total, metodo_pago) VALUES (?, ?)',
      [total, metodo_pago || 'efectivo']
    );
    const idVenta = ventaResult.insertId;

    for (const item of productos) {
      const idProd = item.id_producto || item.id;
      const subtotal = item.subtotal || item.cantidad * item.precio_unitario;

      await connection.query(
        'INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [idVenta, idProd, item.cantidad, item.precio_unitario, subtotal]
      );

      await connection.query(
        'UPDATE Productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, idProd]
      );
    }

    await connection.commit();
    res.status(200).json({ mensaje: 'Venta registrada con éxito', id_venta: idVenta });
  } catch (error) {
    await connection.rollback();
    console.error('Error al procesar la venta:', error);
    res.status(500).json({ error: 'Error al registrar la venta en la base de datos' });
  } finally {
    connection.release();
  }
});

module.exports = router;