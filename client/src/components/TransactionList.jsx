export default function TransactionList({ transactions }) {
  if (!transactions.length) {
    return <p className="muted">No transactions yet.</p>;
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => (
        <li key={tx.transactionId}>
          <div>
            <strong>{tx.service}</strong>
            <p>{new Date(tx.createdAt).toLocaleString()}</p>
          </div>
          <span>-{tx.amount.toLocaleString()} VND</span>
        </li>
      ))}
    </ul>
  );
}
