import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import { SkeletonDashboard } from '../../shared/components/SkeletonLoaders';
import { getMyRegistrationStatus } from '../services/studentAPI';

export default function StudentDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState('PENDING');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDate = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    const loadInitialData = async () => {
      if (!token || !userDate || storedRole !== 'student') {
        navigate('/auth/login');
        return;
      }
      
      setUser(JSON.parse(userDate));

      try {
        const statusRes = await getMyRegistrationStatus();
        if (statusRes && statusRes.exists) {
          setRegistrationStatus(statusRes.status);
        }
      } catch (e) {
        console.error("Failed to get registration status:", e);
      }

      setLoading(false);
    };

    loadInitialData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/login');
  };

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <StudentDashboard
      user={user}
      loading={loading}
      onLogout={handleLogout}
      registrationStatus={registrationStatus}
    />
  );
}
