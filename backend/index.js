const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios.routes');
const citasRoutes = require('./routes/citas.routes');
const productosRoutes = require('./routes/productos.routes');
const ventasRoutes = require('./routes/ventas.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api', usuariosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend de Paw-Portal corriendo en http://localhost:${PORT}`);
});