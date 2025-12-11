import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

export default function DashboardContainer() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const studentData = localStorage.getItem('student');

    if (!token || !studentData) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      // Parse student data from localStorage
      const parsedStudent = JSON.parse(studentData);
      setStudent(parsedStudent);
    } catch (error) {
      console.error('Error parsing student data:', error);
      // Clear invalid data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <Dashboard 
      student={student} 
      onLogout={handleLogout} 
      loading={loading} 
    />
  );
}