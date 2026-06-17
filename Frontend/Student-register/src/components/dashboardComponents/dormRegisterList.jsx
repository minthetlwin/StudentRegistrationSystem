import { useState, useEffect } from 'react';
import { getDormRegistrations, updateDormStatus } from '../../services/adminServices';
import { exportToExcel } from '../../utils/exportUtils';
import ViewDetail from '../adminComponents/viewDetail';


export default function DormRegisterList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getDormRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateDormStatus(selectedRegistration._id, {
        status: newStatus,
        version: selectedRegistration.version || 0
      });

      setMessage(`Registration ${newStatus.toLowerCase()} successfully!`);
      setTimeout(() => setMessage(''), 3000);
      closeModal();
      fetchRegistrations();
    } catch (error) {
      if (error.message === 'Registration has been updated by another admin') {
        setMessage('This registration has been updated by another admin. Please refresh.');
        setTimeout(() => setMessage(''), 5000);
        closeModal();
        fetchRegistrations();
      } else {
        setMessage('Error updating status: ' + error.message);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const closeModal = () => {
    setSelectedRegistration(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading registrations...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm border ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50/30">
          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => exportToExcel(registrations)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
              >
                EXPORT
              </button>
            </div>
          </div>
        </div>
        
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <p className="text-gray-500 text-lg">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {reg.student?.full_name?.charAt(0) || 'N'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {reg.student?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reg.student?.enrollment_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reg.semester?.name}</div>
                      <div className="text-sm text-gray-500">{reg.semester?.academicYear}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(reg)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ViewDetail
        open={!!selectedRegistration}
        onClose={closeModal}
        studentData={selectedRegistration}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>


  </div>
  );
}