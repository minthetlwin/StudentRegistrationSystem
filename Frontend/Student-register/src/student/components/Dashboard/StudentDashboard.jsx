// Student-specific dashboard wrapper
// This component passes student context to the shared Dashboard
import Dashboard from '../../../shared/components/Dashboard';

export default function StudentDashboard({
  user,
  onLogout,
  loading = false,
  registrationStatus = 'PENDING'
}) {
  return (
    <Dashboard
      user={user}
      role="student"
      loading={loading}
      onLogout={onLogout}
      registrationStatus={registrationStatus}
    />
  );
}
