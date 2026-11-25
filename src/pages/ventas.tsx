import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  Bone,
  Pill,
  Tag,
  Package,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import type { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

export const VentasPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<'todos' | 'alimentos' | 'medicamentos' | 'accesorios'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showTicket, setShowTicket] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      console.error('Error al cargar productos:', error);
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

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

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
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCart = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleGenerarTicket = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const payload = {
      total: totalCart,
      metodo_pago: 'efectivo',
      productos: cart.map((item) => ({
        id: Number(item.product.id),
        id_producto: Number(item.product.id),
        cantidad: item.quantity,
        precio_unitario: item.product.price,
        subtotal: item.product.price * item.quantity,
      })),
    };

    try {
      const response = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowTicket(true);
        fetchProducts();
      } else {
        alert('Hubo un error al registrar la venta en el servidor.');
      }
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCerrarTicket = () => {
    setShowTicket(false);
    setCart([]);
  };

  const storedUser = localStorage.getItem('paw_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { nombre: 'Usuario', rol: 'Staff' };
  const formattedRol = currentUser.rol
    ? currentUser.rol.charAt(0).toUpperCase() + currentUser.rol.slice(1)
    : 'Staff';

  return (
    <main className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
            />
            <input
              type="search"
              className="search-input"
              placeholder="Buscar producto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem' }}
            />
          </div>

          <section className="filter-buttons" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
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

          <section className="product-grid">
            {filtered.map((prod) => (
              <article key={prod.id} className="product-card">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    background: '#dff5ef',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    width: 'fit-content',
                    textTransform: 'uppercase',
                  }}
                >
                  {getCategoryIcon(prod.category)}
                  {prod.category}
                </span>

                <h3 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1.05rem', color: '#0f172a' }}>{prod.name}</h3>
                <p style={{ fontWeight: 'bold', color: '#166534', margin: '0', fontSize: '1.1rem' }}>
                  ${prod.price.toFixed(2)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>MXN</span>
                </p>

                <p
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    color: prod.stock > 5 ? '#64748b' : prod.stock > 0 ? '#d97706' : '#dc2626',
                    margin: '0.3rem 0 0.8rem 0',
                  }}
                >
                  <Package size={14} />
                  Stock disponible: <strong>{prod.stock}</strong>
                </p>

                <button
                  className="btn-primary"
                  style={{ marginTop: 'auto', opacity: prod.stock === 0 ? 0.5 : 1 }}
                  onClick={() => addToCart(prod)}
                  disabled={prod.stock === 0}
                >
                  <Plus size={16} />
                  {prod.stock === 0 ? 'Agotado' : 'Agregar a la lista'}
                </button>
              </article>
            ))}
          </section>
        </div>

        <aside
          style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            gap: '1rem',
            position: 'sticky',
            top: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
              <ShoppingCart size={19} color="var(--primary, #0d7a68)" />
              Resumen de Venta
            </span>
            {totalItems > 0 && (
              <span style={{ background: '#dff5ef', color: 'var(--primary, #0d7a68)', fontSize: '0.78rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <ShoppingCart size={36} style={{ margin: '0 auto 0.6rem auto', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', margin: 0 }}>La lista está vacía.</p>
              <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>Selecciona productos del catálogo para comenzar.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '0.7rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>{item.product.name}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      title="Quitar producto"
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.3rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.45rem' }}
                        onClick={() => decrementQuantity(item.product.id)}
                        title="Quitar uno"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '22px', textAlign: 'center', fontSize: '0.95rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.25rem 0.45rem' }}
                        onClick={() => incrementQuantity(item.product.id)}
                        title="Agregar uno más"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Total a cobrar:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  ${totalCart.toFixed(2)} MXN
                </span>
              </div>

              <button
                className="btn-primary"
                style={{ marginTop: '0.4rem', width: '100%', padding: '0.75rem' }}
                onClick={handleGenerarTicket}
                disabled={isProcessing}
              >
                <Receipt size={18} />
                {isProcessing ? 'Procesando venta...' : 'Generar e Imprimir Ticket'}
              </button>
            </div>
          )}
        </aside>
      </div>

      {showTicket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-box">
            <div style={{ display: 'flex', justifyContent: 'center', color: '#166534', marginBottom: '0.3rem' }}>
              <CheckCircle2 size={34} />
            </div>
            <h2 style={{ textAlign: 'center', margin: 0 }}>PAW PORTAL</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Veterinaria y Accesorios</p>
            <hr />
            <p>
              <strong>Venta realizada por:</strong> {currentUser.nombre} ({formattedRol})
            </p>
            <p>
              <strong>Fecha:</strong> {new Date().toLocaleString()}
            </p>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <p style={{ fontSize: '1.15rem', textAlign: 'right' }}>
              <strong>TOTAL: ${totalCart.toFixed(2)} MXN</strong>
            </p>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
              ¡Gracias por su compra!
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontFamily: 'system-ui' }}>
              <button className="btn-secondary" onClick={handleCerrarTicket}>
                Cerrar
              </button>
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={16} />
                Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};