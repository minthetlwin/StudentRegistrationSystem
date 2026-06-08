import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';

function AdminApp() {
  return (
    <Routes>
      {/* Admin dashboard routes - Protected */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default AdminApp;
