// Admin Portal Routes Configuration
import DashboardPage from './pages/DashboardPage';

export const adminRoutes = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
    protected: true
  },
];
