import React, { useState } from 'react';
import type { Product } from '../types';

const initialInventory: Product[] = [
  { id: '1', name: 'Croquetas Perro Adulto 20kg', category: 'alimentos', price: 850.0, stock: 12 },
  { id: '2', name: 'Desparasitante Externo (Pipeta)', category: 'medicamentos', price: 180.5, stock: 25 },
  { id: '3', name: 'Collar Ajustable Reflectante', category: 'accesorios', price: 120.0, stock: 8 },
  { id: '4', name: 'Latas de Paté Húmedo Gato', category: 'alimentos', price: 35.0, stock: 40 },
  { id: '5', name: 'Antibiótico en Suspensión 50ml', category: 'medicamentos', price: 240.0, stock: 6 },
];

export const InventarioPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialInventory);
  const [category, setCategory] = useState<'todos' | 'alimentos' | 'medicamentos' | 'accesorios'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'alimentos',
    price: 0,
    stock: 0,
  });

  const filtered = products.filter((p) => {
    const matchCat = category === 'todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleStockChange = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedStock = Math.max(0, p.stock + delta);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const created: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: (newProduct.category as 'alimentos' | 'medicamentos' | 'accesorios') || 'alimentos',
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
    };

    setProducts((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'alimentos', price: 0, stock: 0 });
  };

  return (
    <main className="page-container">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Agregar Nuevo Producto
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar producto en el inventario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />

        <section className="filter-buttons" style={{ justifyContent: 'flex-start' }}>
          {(['todos', 'alimentos', 'medicamentos', 'accesorios'] as const).map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </section>
      </div>

      <section style={{ background: 'white', borderRadius: '12px', border: '2px solid #e2e8f0', padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
              <th style={{ padding: '0.75rem' }}>Nombre del Producto</th>
              <th style={{ padding: '0.75rem' }}>Categoría</th>
              <th style={{ padding: '0.75rem' }}>Precio Unitario</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No se encontraron productos en esta sección.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#0f172a' }}>{p.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', background: '#dff5ef', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#166534', fontWeight: 'bold' }}>${p.price.toFixed(2)} MXN</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '1rem' }} onClick={() => handleStockChange(p.id, -1)} title="Restar stock">-</button>
                      <span style={{ fontWeight: 'bold', minWidth: '35px', textAlign: 'center', fontSize: '1.05rem' }}>{p.stock}</span>
                      <button className="btn-primary" style={{ padding: '0.2rem 0.6rem', fontSize: '1rem' }} onClick={() => handleStockChange(p.id, 1)} title="Sumar stock">+</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registrar Nuevo Producto</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre del Producto *</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="Ej. Shampoo Antipulgas 500ml"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Categoría *</label>
                <select
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                >
                  <option value="alimentos">Alimentos</option>
                  <option value="medicamentos">Medicamentos</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="0.00"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stock Inicial *</label>
                  <input
                    type="number"
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="0"
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar en Inventario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};