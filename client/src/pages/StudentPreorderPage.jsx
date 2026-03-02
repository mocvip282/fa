import { useMemo, useState } from 'react';
import http from '../api/http';
import Layout from '../components/Layout';

const menu = [
  { id: 'coffee', label: 'Milk Coffee', price: 25000 },
  { id: 'banhmi', label: 'Banh Mi', price: 30000 },
  { id: 'tea', label: 'Peach Tea', price: 20000 }
];

export default function StudentPreorderPage() {
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const total = useMemo(() => selected.reduce((sum, id) => sum + (menu.find((m) => m.id === id)?.price || 0), 0), [selected]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const checkout = async () => {
    setMessage('');
    setError('');
    if (!selected.length) return;
    try {
      await http.post('/student/preorder/pay', {
        amount: total,
        items: menu.filter((m) => selected.includes(m.id))
      });
      setMessage(`Preorder paid: ${total.toLocaleString()} VND`);
      setSelected([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Preorder payment failed.');
    }
  };

  return (
    <Layout title="Preorder Demo">
      <section className="card">
        {menu.map((item) => (
          <label key={item.id} className="row">
            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
            <span>{item.label} - {item.price.toLocaleString()} VND</span>
          </label>
        ))}
        <p><strong>Total: {total.toLocaleString()} VND</strong></p>
        <button onClick={checkout} disabled={!selected.length}>Checkout</button>
        {message && <p className="ok">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>
    </Layout>
  );
}
