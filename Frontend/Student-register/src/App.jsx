import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLoginPage from './auth/pages/StudentLoginPage';
import AdminLoginPage from './auth/pages/AdminLoginPage';
import StudentRegistrationPage from './auth/pages/StudentRegistrationPage';
import StudentApp from './student/StudentApp';
import AdminApp from './admin/AdminApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== AUTH ROUTES ===== */}
        <Route path="/auth">
          <Route path="login" element={<StudentLoginPage />} />
          <Route path="register" element={<StudentRegistrationPage />} />
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* ===== STUDENT PORTAL ===== */}
        <Route path="/student/*" element={<StudentApp />} />

        {/* ===== ADMIN PORTAL ===== */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* ===== REDIRECT ROUTES ===== */}
        {/* Root redirects to student portal */}
        <Route path="/" element={<Navigate to="/student" replace />} />
        
        {/* Backwards compatibility redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/admin-login" element={<Navigate to="/auth/admin-login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

        {/* 404 - Catch all other routes */}
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
