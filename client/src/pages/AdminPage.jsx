import { useState } from 'react';
import http from '../api/http';
import Layout from '../components/Layout';

export default function AdminPage() {
  const [pin, setPin] = useState('123456');
  const [students, setStudents] = useState([]);
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState(50000);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadStudents = async () => {
    try {
      const { data } = await http.get(`/admin/students?pin=${pin}`);
      setStudents(data.students);
      if (!userId && data.students.length) setUserId(data.students[0].userId);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students.');
    }
  };

  const topUp = async () => {
    try {
      await http.post('/admin/topup', { adminPin: pin, userId, amount: Number(amount) });
      setMessage('Top-up successful.');
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Top-up failed.');
    }
  };

  const reset = async () => {
    try {
      await http.post('/admin/reset', { adminPin: pin });
      setMessage('Demo data reset.');
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <Layout title="Admin Demo Tools">
      <section className="card">
        <label>Admin pin</label>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
        <button onClick={loadStudents}>Load students</button>

        <label>Student</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {students.map((s) => (
            <option key={s.userId} value={s.userId}>{s.name} ({s.balance.toLocaleString()} VND)</option>
          ))}
        </select>

        <label>Top-up amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <div className="row gap">
          <button onClick={topUp}>Top-up</button>
          <button className="secondary" onClick={reset}>Reset demo data</button>
        </div>
        {message && <p className="ok">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>
    </Layout>
  );
}
