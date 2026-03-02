import { useState } from 'react';
import Layout from '../components/Layout';

const rooms = [
  { room: 'A801', slot: '08:00 - 10:00' },
  { room: 'B305', slot: '10:00 - 12:00' },
  { room: 'C201', slot: '14:00 - 16:00' }
];

export default function StudentRoomsPage() {
  const [request, setRequest] = useState('');

  return (
    <Layout title="Room Booking">
      <section className="card">
        {rooms.map((r) => (
          <button key={r.room + r.slot} className="tile" onClick={() => setRequest(`Request sent for ${r.room} (${r.slot})`)}>
            {r.room} · {r.slot}
          </button>
        ))}
        {request && <p className="ok">{request} (mock approval)</p>}
      </section>
    </Layout>
  );
}
