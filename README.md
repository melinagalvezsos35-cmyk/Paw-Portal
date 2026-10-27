# Paw Portal - Sistema de Gestión Veterinaria y Ventas
Actividad Sumativa 2 - Equipo 6 (Grupo LITIID42)

## Integrantes del Equipo
* Jaydy Melina Galvez Sosa
* Daira Itzel Sosa Pech
* Arianna Sayuri Rivera Martínez
* Yahir Alexis Tun Mena


## 1. Planteamiento del Problema y Objetivo
Paw Portal es una aplicación web desarrollada en React y TypeScript para optimizar la administración clínica de una veterinaria. El sistema resuelve la desorganización en el agendamiento de citas, el control de inventario de productos (alimentos, medicamentos y accesorios), la ejecución de un punto de venta interactivo con tickets y la protección contra el abandono de mascotas mediante el registro y verificación de identificaciones (INE).

Nota de arquitectura: Actualmente el sistema opera utilizando datos locales y temporales (estado en memoria y arreglos simulados) en preparación para su futura conexión con una base de datos externa.


## 2. Flujo del Proceso y Reglas de Negocio

### Módulo de Citas (CitasPage.tsx):
1. Búsqueda Global y Filtrado: Cuenta con un buscador que revisa todas las citas guardadas y un selector de fecha rápido en la parte superior.
2. Paneles Informativos: Organizado en dos grandes secciones en la parte inferior: Citas Confirmadas del Día (según la fecha seleccionada) y Solicitudes Por Confirmar.
3. Reglas de Negocio: Captura datos de contacto (teléfono principal y secundario), nombre del responsable y paciente, empleado asignado, estatus de pago y la obligatoriedad de verificar si dejó credencial INE (medida anti-abandono).

### Módulo de Ventas (VentasPage.tsx):
1. Catálogo por Secciones: Visualización de productos divididos por categorías (Alimentos, Medicamentos, Accesorios) con indicador en tiempo real del stock disponible.
2. Lista de Ventas / Carrito Interactivo: Permite agregar productos y controlar las cantidades de forma flexible:
   * Botones de incremento (+) y decremento (-) para sumar o restar unidades de uno en uno.
   * Botón de eliminación total para retirar un producto por completo de la lista con un solo clic.
3. Generación de Ticket: Muestra una pantalla flotante (modal) con el desglose de la venta, total y la opción de impresión.

### Módulo de Inventario (InventarioPage.tsx):
1. Administración de Stock: Vista independiente para observar las existencias de productos filtrados por sección.
2. Control Manual: Botones de incremento y decremento directo de stock (+ / -) con soporte temporal para simular actualizaciones de inventario.
3. Registro de Nuevos Productos: Pantalla flotante (modal) para dar de alta artículos especificando nombre, categoría, precio y cantidad inicial.


## 3. Mapa de Navegación y Vistas (Navbar.tsx)

El sistema cuenta con una barra de navegación superior fija que permite transicionar de manera fluida entre las siguientes vistas:
* LoginPage: Acceso inicial al sistema por usuario y contraseña.
* HomePage: Panel de bienvenida con accesos directos a los módulos.
* CitasPage: Gestión de citas con buscador global y filtros por fecha.
* VentasPage: Punto de venta con control de stock, carrito interactivo y tickets.
* InventarioPage: Administración exclusiva de productos y existencias.


## 4. Tecnologías Utilizadas
* React (v18+) con componentes funcionales.
* TypeScript (.tsx) para el tipado estático y robustez del código.
* Vite como entorno de desarrollo rápido.
* CSS Nativo Compartido (global.css) para unificar el diseño visual.

## 5. Instrucciones de Instalación y Ejecución

Para clonar y poner en marcha este proyecto de manera local, ejecuta los siguientes comandos en tu terminal:

1. Clonar el repositorio:
   ```bash
   git clone <url-de-tu-repositorio>
   cd proyecto-web/pawportal