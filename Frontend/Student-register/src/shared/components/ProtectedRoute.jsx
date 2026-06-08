import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && role !== requiredRole && role !== 'superadmin') {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
