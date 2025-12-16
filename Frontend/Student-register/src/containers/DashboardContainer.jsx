import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';


export default function DashboardContainer() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDate = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (!token || !userDate || !storedRole) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userDate));
    setRole(storedRole);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Dashboard
      user={user}
      role={role}
      loading={loading}
      onLogout={handleLogout}
    />
  );
}
