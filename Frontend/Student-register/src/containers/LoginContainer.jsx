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
      console.log('Login result:', result);
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role || result.user.role || 'student');
        
        // console.log('Stored in localStorage:', {
        //   student: result.student,
        //   token: !!result.token,
        //   role: result.role || result.student.role
        // });
        
        setMessage('✓ Login successful! Redirecting...');
        
        
        setTimeout(() => {
        
            navigate('/dashboard'); // Student dashboard
         
        }, 1500);
      } else {
        setMessage('✗ ' + (result.message || 'Login failed'));
      }
    } catch (error) {
      console.error('Login error:', error);
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