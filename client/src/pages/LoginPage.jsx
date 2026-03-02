import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../api/http';
import Layout from '../components/Layout';
import { setSession } from '../components/session';

export default function LoginPage() {
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('FTU20230001');
  const [pin, setPin] = useState('1111');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await http.post('/login', { studentId, pin, role });
      setSession(data);
      navigate(role === 'student' ? '/student/home' : '/merchant/pos');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <Layout title="FA Prototype Login">
      <form className="card" onSubmit={onSubmit}>
        <label>Role</label>
        <select
          value={role}
          onChange={(e) => {
            const selectedRole = e.target.value;
            setRole(selectedRole);
            if (selectedRole === 'merchant') {
              setStudentId('m1');
              setPin('9999');
            } else {
              setStudentId('FTU20230001');
              setPin('1111');
            }
          }}
        >
          <option value="student">Student</option>
          <option value="merchant">Merchant</option>
        </select>

        <label>{role === 'student' ? 'Student ID' : 'Merchant ID'}</label>
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />

        <label>PIN</label>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} required />

        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <p className="muted">Demo: students PIN 1111, merchant m1 / 9999</p>
      </form>
    </Layout>
  );
}
