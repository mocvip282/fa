import { useCallback, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import http from '../api/http';
import Layout from '../components/Layout';
import TransactionList from '../components/TransactionList';

export default function StudentWalletPage() {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletToken, setWalletToken] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const loadProfileAndTransactions = useCallback(async () => {
    const [meRes, txRes] = await Promise.all([http.get('/me'), http.get('/transactions?limit=5')]);
    setProfile(meRes.data.profile);
    setTransactions(txRes.data.transactions);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const { data } = await http.post('/wallet/token');
      setWalletToken(data);
      setCountdown(Math.max(0, Math.ceil((data.expiresAt - Date.now()) / 1000)));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh token.');
    }
  }, []);

  useEffect(() => {
    loadProfileAndTransactions();
    refreshToken();
    const tokenInterval = setInterval(refreshToken, 10000);
    const secondInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(secondInterval);
    };
  }, [loadProfileAndTransactions, refreshToken]);

  return (
    <Layout title="My Wallet">
      {profile && (
        <section className="card">
          <p><strong>{profile.name}</strong></p>
          <p>{profile.studentId}</p>
          <h2>{profile.balance.toLocaleString()} VND</h2>
        </section>
      )}

      <section className="card center">
        <h3>Dynamic Payment QR</h3>
        {walletToken && (
          <>
            <QRCodeCanvas value={walletToken.token} size={190} includeMargin />
            <p className="code">{walletToken.shortCode}</p>
            <p className="muted">Expires in {countdown}s</p>
          </>
        )}
        <button onClick={refreshToken}>Refresh now</button>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h3>Last 5 transactions</h3>
        <TransactionList transactions={transactions} />
      </section>
    </Layout>
  );
}
