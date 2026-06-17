import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { SkeletonDashboard } from '../components/SkeletonLoaders';

import { getMyRegistrationStatus } from '../services/studentAPI';

export default function DashboardContainer() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState('PENDING');
  const [registrationExists, setRegistrationExists] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDate = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    const loadInitialData = async () => {
      if (!token || !userDate || !storedRole) {
        navigate('/login');
        return;
      }
      setUser(JSON.parse(userDate));
      setRole(storedRole);

      if (storedRole === 'student') {
        try {
          const statusRes = await getMyRegistrationStatus();
          setIsRegistrationOpen(statusRes.isRegistrationOpen || false);
          setIsPaymentOpen(statusRes.isPaymentOpen || false);

          if (statusRes && statusRes.exists) {
            setRegistrationStatus(statusRes.status);
            setRegistrationExists(true);
          } else {
            setRegistrationExists(false);
          }
        } catch (e) {
          console.error("Failed to get registration status:", e);
        }
      }

      setLoading(false);
    };

    loadInitialData();
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
      registrationStatus={registrationStatus}
      registrationExists={registrationExists}
      isRegistrationOpen={isRegistrationOpen}
      isPaymentOpen={isPaymentOpen}
    />
  );
}
