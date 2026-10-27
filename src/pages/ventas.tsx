import React, { useState } from 'react';
import type { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Croquetas Perro Adulto 20kg', category: 'alimentos', price: 850.0, stock: 12 },
  { id: '2', name: 'Desparasitante Externo (Pipeta)', category: 'medicamentos', price: 180.5, stock: 25 },
  { id: '3', name: 'Collar Ajustable Reflectante', category: 'accesorios', price: 120.0, stock: 8 },
  { id: '4', name: 'Latas de Paté Húmedo Gato', category: 'alimentos', price: 35.0, stock: 40 },
  { id: '5', name: 'Antibiótico en Suspensión 50ml', category: 'medicamentos', price: 240.0, stock: 6 },
];

export const VentasPage: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [category, setCategory] = useState<'todos' | 'alimentos' | 'medicamentos' | 'accesorios'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showTicket, setShowTicket] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat = category === 'todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        alert('Has alcanzado el límite del stock disponible.');
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const incrementQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (item.quantity < item.product.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
          alert('No hay más stock disponible para este producto.');
        }
        return item;
      })
    );
  };

  const decrementQuantity = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCart = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <main className="page-container">

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <input
            type="search"
            className="search-input"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
          />

          <section className="filter-buttons" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
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

          <section className="product-grid">
            {filtered.map((prod) => (
              <article key={prod.id} className="product-card">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', background: '#dff5ef', padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
                  {prod.category}
                </span>
                <h3 style={{ margin: '0.2rem 0' }}>{prod.name}</h3>
                <p style={{ fontWeight: 'bold', color: '#166534', margin: '0' }}>${prod.price.toFixed(2)} MXN</p>
                
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0' }}>
                  Stock disponible: <strong>{prod.stock}</strong>
                </p>

                <button
                  className="btn-primary"
                  style={{ marginTop: 'auto' }}
                  onClick={() => addToCart(prod)}
                >
                  + Agregar a la lista
                </button>
              </article>
            ))}
          </section>
        </div>

        <aside style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: 'fit-content', gap: '1rem' }}>
          
          {cart.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>La lista está vacía. Selecciona productos del catálogo.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.product.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.1rem 0.5rem', fontSize: '0.9rem' }}
                        onClick={() => decrementQuantity(item.product.id)}
                        title="Quitar uno"
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.1rem 0.5rem', fontSize: '0.9rem' }}
                        onClick={() => incrementQuantity(item.product.id)}
                        title="Agregar uno más"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn-danger"
                    style={{ alignSelf: 'flex-end', padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Quitar producto
                  </button>
                </div>
              ))}

              <hr style={{ margin: '0.5rem 0', borderColor: '#e2e8f0' }} />
              
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold', textAlign: 'right', color: '#0f172a' }}>
                Total: ${totalCart.toFixed(2)} MXN
              </div>

              <button
                className="btn-primary"
                style={{ marginTop: '0.5rem', width: '100%' }}
                onClick={() => setShowTicket(true)}
              >
                Generar e Imprimir Ticket
              </button>
            </div>
          )}
        </aside>
      </div>

      {showTicket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-box">
            <h2 style={{ textAlign: 'center', margin: 0 }}>PAW PORTAL</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Veterinaria y Accesorios</p>
            <hr />
            <p><strong>Venta realizada por:</strong> Arianna Rivera (Admin)</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <p style={{ fontSize: '1.1rem', textAlign: 'right' }}>
              <strong>TOTAL: ${totalCart.toFixed(2)} MXN</strong>
            </p>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>¡Gracias por su compra!</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontFamily: 'system-ui' }}>
              <button className="btn-secondary" onClick={() => setShowTicket(false)}>Cerrar</button>
              <button className="btn-primary" onClick={() => window.print()}>Imprimir Ticket</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};