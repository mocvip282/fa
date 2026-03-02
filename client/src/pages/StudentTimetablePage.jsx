import Layout from '../components/Layout';

export default function StudentTimetablePage() {
  return (
    <Layout title="Timetable">
      <section className="card">
        <ul>
          <li>Mon 08:00 - International Trade</li>
          <li>Tue 13:30 - Business Analytics</li>
          <li>Thu 09:45 - Marketing Strategy</li>
          <li>Fri 15:00 - Project Workshop</li>
        </ul>
      </section>
    </Layout>
  );
}
