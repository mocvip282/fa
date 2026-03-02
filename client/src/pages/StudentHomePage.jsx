import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getStoredProfile } from '../components/session';

const apps = [
  { label: 'Wallet', path: '/student/wallet' },
  { label: 'Preorder', path: '/student/preorder' },
  { label: 'Room Booking', path: '/student/rooms' },
  { label: 'Timetable', path: '/student/timetable' },
  { label: 'Settings', path: '/student/home' }
];

export default function StudentHomePage() {
  const profile = getStoredProfile();
  const navigate = useNavigate();

  return (
    <Layout title="Student Dashboard">
      <section className="card">
        <h3>Hello, {profile?.name}</h3>
        <p className="muted">{profile?.studentId}</p>
      </section>
      <section className="grid">
        {apps.map((app) => (
          <button key={app.label} className="tile" onClick={() => navigate(app.path)}>
            {app.label}
          </button>
        ))}
      </section>
    </Layout>
  );
}
