import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import http from '../api/http';
import Layout from '../components/Layout';

const services = ['canteen', 'cafe', 'parking', 'preorder'];

export default function MerchantPOSPage() {
  const [service, setService] = useState('canteen');
  const [amount, setAmount] = useState(30000);
  const [tokenOrCode, setTokenOrCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const { data } = await http.get('/transactions?limit=10');
    setTransactions(data.transactions);
  };

  useEffect(() => {
    loadTransactions();

    const scanner = new Html5Qrcode('scanner');
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices.length) return;
        scanner.start(
          { facingMode: 'environment' },
          { fps: 5, qrbox: { width: 200, height: 200 } },
          (decodedText) => setTokenOrCode(decodedText),
          () => {}
        );
      })
      .catch(() => {});

    return () => {
      scanner.stop().catch(() => {});
      scanner.clear().catch(() => {});
    };
  }, []);

  const charge = async () => {
    setMessage('');
    setError('');
    try {
      const { data } = await http.post('/merchant/charge', {
        tokenOrCode,
        amount: Number(amount),
        service
      });
      setMessage(`Success: ${data.transaction.studentName} charged ${data.transaction.amount.toLocaleString()} VND`);
      setTokenOrCode('');
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Charge failed.');
    }
  };

  return (
    <Layout title="Merchant POS">
      <section className="card">
        <label>Service</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label>Amount (VND)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label>Scan QR (webcam)</label>
        <div id="scanner" className="scanner" />

        <label>Token / short code (manual fallback)</label>
        <input value={tokenOrCode} onChange={(e) => setTokenOrCode(e.target.value)} placeholder="Paste token or code" />

        <button onClick={charge}>Charge</button>
        {message && <p className="ok">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h3>Last 10 transactions</h3>
        <ul className="tx-list">
          {transactions.map((tx) => (
            <li key={tx.transactionId}>
              <div>
                <strong>{tx.studentName} · {tx.service}</strong>
                <p>{new Date(tx.createdAt).toLocaleString()}</p>
              </div>
              <span>{tx.amount.toLocaleString()} VND</span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
