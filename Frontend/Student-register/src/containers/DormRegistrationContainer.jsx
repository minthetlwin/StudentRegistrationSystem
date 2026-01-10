import React, { useState } from 'react';
import DormRegisterForm from '../components/studentComponents/dormRegistrationForm';
import { registerForDorm } from '../services/studentAPI';

export default function DormRegistrationContainer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleDormRegistration = async (data) => {
    console.log('Container received data:', data);
    setLoading(true);
    setMessage('');
    setShouldReset(false);
    
    try {
      const result = await registerForDorm(data);
      console.log('Dorm registration result:', result);
      
      if (result.success) {
        setMessage('✓ ' + (result.message || 'Dorm registration submitted successfully!'));
        setShouldReset(true); // Trigger form reset
      } else {
        setMessage('✗ ' + (result.message || 'Registration failed'));
      }
    } catch (error) {
      console.error('Dorm registration error:', error);
      setMessage('✗ ' + (error.message || 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
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
        
        <DormRegisterForm onSubmit={handleDormRegistration} loading={loading} shouldReset={shouldReset} />
      </div>
    </div>
  );
}