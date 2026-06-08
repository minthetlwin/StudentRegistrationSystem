import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import { SkeletonDashboard } from '../../shared/components/SkeletonLoaders';

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDate = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    const loadInitialData = async () => {
      if (!token || !userDate || (storedRole !== 'admin' && storedRole !== 'superadmin')) {
        navigate('/auth/admin-login');
        return;
      }
      
      setUser(JSON.parse(userDate));
      setRole(storedRole);
      setLoading(false);
    };

    loadInitialData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/admin-login');
  };

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <AdminDashboard
      user={user}
      role={role}
      loading={loading}
      onLogout={handleLogout}
    />
  );
}
