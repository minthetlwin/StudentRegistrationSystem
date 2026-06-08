// Student Portal Routes Configuration
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';

export const studentRoutes = [
  {
    path: '/',
    element: <HomePage />,
    protected: false
  },
  {
    path: '/register',
    element: <RegistrationPage />,
    protected: false
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    protected: true
  },
];
