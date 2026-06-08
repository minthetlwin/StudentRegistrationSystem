// Admin-specific dashboard wrapper
// This component passes admin context to the shared Dashboard
import Dashboard from '../../../shared/components/Dashboard';

export default function AdminDashboard({
  user,
  role,
  onLogout,
  loading = false
}) {
  return (
    <Dashboard
      user={user}
      role={role || 'admin'}
      loading={loading}
      onLogout={onLogout}
    />
  );
}
