import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './layouts/StudentLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';

function StudentApp() {
  return (
    <Routes>
      {/* Public routes with StudentLayout (Navbar) */}
      <Route path="/" element={<StudentLayout><HomePage /></StudentLayout>} />
      <Route path="/register" element={<StudentLayout><RegistrationPage /></StudentLayout>} />
      
      {/* Protected routes without StudentLayout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  );
}

export default StudentApp;
