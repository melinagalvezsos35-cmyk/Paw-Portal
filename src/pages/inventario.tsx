import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  PackagePlus,
  Bone,
  Pill,
  Tag,
  Package,
  AlertTriangle,
} from 'lucide-react';
import type { Product } from '../types';

export const InventarioPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<'todos' | 'alimentos' | 'medicamentos' | 'accesorios'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'alimentos',
    price: 0,
    stock: 0,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/productos');
      if (response.ok) {
        const data = await response.json();
        const mappedProducts: Product[] = data.map((row: any) => ({
          id: row.id.toString(),
          name: row.nombre,
          category: row.categoria.toLowerCase() as 'alimentos' | 'medicamentos' | 'accesorios',
          price: Number(row.precio_venta),
          stock: Number(row.stock),
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === 'todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'alimentos':
        return <Bone size={13} />;
      case 'medicamentos':
        return <Pill size={13} />;
      case 'accesorios':
        return <Tag size={13} />;
      default:
        return <Package size={13} />;
    }
  };

  const handleStockChange = async (id: string, delta: number) => {
    const currentProduct = products.find((p) => p.id === id);
    if (!currentProduct) return;

    const updatedStock = Math.max(0, currentProduct.stock + delta);

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: updatedStock } : p)));

    try {
      await fetch(`http://localhost:3000/api/productos/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: updatedStock }),
      });
    } catch (error) {
      console.error('Error al actualizar stock en BD:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const rawCat = newProduct.category || 'alimentos';
    const formattedCat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);

    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newProduct.name,
          categoria: formattedCat,
          precio_venta: Number(newProduct.price) || 0,
          stock: Number(newProduct.stock) || 0,
        }),
      });

      if (response.ok) {
        await fetchProducts();
        setIsModalOpen(false);
        setNewProduct({ name: '', category: 'alimentos', price: 0, stock: 0 });
      } else {
        alert('Error al guardar el producto en el servidor.');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <main className="page-container">
      <header
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontSize: '0.9rem' }}>
          <Package size={18} color="var(--primary, #0d7a68)" />
          <span>
            Mostrando <strong>{filtered.length}</strong> de {products.length} productos en catálogo
          </span>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <PackagePlus size={18} />
          Agregar Nuevo Producto
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
          />
          <input
            type="search"
            className="search-input"
            placeholder="Buscar producto en el inventario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem' }}
          />
        </div>

        <section className="filter-buttons" style={{ justifyContent: 'flex-start' }}>
          {(['todos', 'alimentos', 'medicamentos', 'accesorios'] as const).map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {getCategoryIcon(cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </section>
      </div>

      <section
        style={{
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
          padding: '1rem',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.88rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem' }}>Producto</th>
              <th style={{ padding: '0.85rem' }}>Categoría</th>
              <th style={{ padding: '0.85rem' }}>Precio Unitario</th>
              <th style={{ padding: '0.85rem', textAlign: 'center' }}>Existencias</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No se encontraron productos en esta sección.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isLowStock = p.stock <= 5;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {p.name}
                        {isLowStock && (
                          <span
                            title="Stock bajo"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.72rem',
                              background: p.stock === 0 ? '#fee2e2' : '#fef3c7',
                              color: p.stock === 0 ? '#dc2626' : '#b45309',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              fontWeight: 700,
                            }}
                          >
                            <AlertTriangle size={12} />
                            {p.stock === 0 ? 'Agotado' : 'Bajo'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.74rem',
                          fontWeight: 'bold',
                          color: 'var(--primary)',
                          background: '#dff5ef',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {getCategoryIcon(p.category)}
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem', color: '#166534', fontWeight: 700 }}>${p.price.toFixed(2)} MXN</td>
                    <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.55rem' }}
                          onClick={() => handleStockChange(p.id, -1)}
                          title="Restar stock"
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          style={{
                            fontWeight: 700,
                            minWidth: '35px',
                            textAlign: 'center',
                            fontSize: '1.05rem',
                            color: p.stock === 0 ? '#dc2626' : isLowStock ? '#d97706' : '#0f172a',
                          }}
                        >
                          {p.stock}
                        </span>
                        <button
                          className="btn-primary"
                          style={{ padding: '0.3rem 0.55rem' }}
                          onClick={() => handleStockChange(p.id, 1)}
                          title="Sumar stock"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <PackagePlus size={22} color="var(--primary, #0d7a68)" />
              Registrar Nuevo Producto
            </h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.2rem' }}>
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
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};