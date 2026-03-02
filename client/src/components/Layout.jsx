import { useNavigate } from 'react-router-dom';
import { clearSession, getRole } from './session';

export default function Layout({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="topbar">
        <h1>{title}</h1>
        {getRole() && (
          <button
            className="secondary"
            onClick={() => {
              clearSession();
              navigate('/login');
            }}
          >
            Logout
          </button>
        )}
      </header>
      {children}
    </div>
  );
}
