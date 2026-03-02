import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentWalletPage from './pages/StudentWalletPage';
import MerchantPOSPage from './pages/MerchantPOSPage';
import StudentPreorderPage from './pages/StudentPreorderPage';
import StudentRoomsPage from './pages/StudentRoomsPage';
import StudentTimetablePage from './pages/StudentTimetablePage';
import AdminPage from './pages/AdminPage';
import { getRole } from './components/session';

function ProtectedRoute({ role, children }) {
  const currentRole = getRole();
  if (currentRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/student/home"
        element={(
          <ProtectedRoute role="student">
            <StudentHomePage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/student/wallet"
        element={(
          <ProtectedRoute role="student">
            <StudentWalletPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/student/preorder"
        element={(
          <ProtectedRoute role="student">
            <StudentPreorderPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/student/rooms"
        element={(
          <ProtectedRoute role="student">
            <StudentRoomsPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/student/timetable"
        element={(
          <ProtectedRoute role="student">
            <StudentTimetablePage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/merchant/pos"
        element={(
          <ProtectedRoute role="merchant">
            <MerchantPOSPage />
          </ProtectedRoute>
        )}
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
