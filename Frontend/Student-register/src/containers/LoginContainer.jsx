import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/authComponents/LoginForm';
import { loginStudent } from '../services/authServices';

export default function LoginContainer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await loginStudent(data);
      
      if (result.success) {
        // Store user data in localStorage or context
        localStorage.setItem('student', JSON.stringify(result.student));
        localStorage.setItem('token', result.token);
        
        setMessage('✓ Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage('✗ ' + (result.message || 'Login failed'));
      }
    } catch (error) {
      setMessage('✗ ' + (error.message || 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {message && (
          <div className={`px-4 py-3 rounded mb-4 text-center font-medium ${
            message.startsWith('✓') 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}
        
        <LoginForm onLogin={handleLogin} loading={loading} />
        
       
      </div>
    </div>
  );
}