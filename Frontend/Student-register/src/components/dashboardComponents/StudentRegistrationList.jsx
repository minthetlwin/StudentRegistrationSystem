import { useState, useEffect } from 'react';
import { getStudentRegistrations, updateStudentRegistrationStatus } from '../../services/adminServices';
import StudentRegistrationDetailModal from '../adminComponents/StudentRegistrationDetailModal';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileDown,
  User 
} from 'lucide-react';

export default function StudentRegistrationList() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, statusFilter, registrations]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getStudentRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = [...registrations];
    
    if (statusFilter !== 'ALL') {
      result = result.filter(reg => reg.status === statusFilter);
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(reg => 
        reg.student?.full_name?.toLowerCase().includes(lowerSearch) ||
        reg.student?.enrollment_number?.toLowerCase().includes(lowerSearch) ||
        reg.nrc?.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredRegistrations(result);
  };

  const handleStatusUpdate = async (id, newStatus, adminRemark) => {
    try {
      await updateStudentRegistrationStatus(id, { status: newStatus, adminRemark });
      setMessage({ text: `Registration ${newStatus.toLowerCase()} successfully!`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      setSelectedReg(null);
      fetchRegistrations();
    } catch (err) {
      setMessage({ text: 'Error: ' + err.message, type: 'error' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center w-fit gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 flex items-center w-fit gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading workspace...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] text-center space-y-4">
      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8 text-rose-600" />
      </div>
      <h3 className="text-xl font-bold text-rose-900">Failed to load registrations</h3>
      <p className="text-rose-600 font-medium max-w-xs mx-auto">{error}</p>
      <button 
        onClick={fetchRegistrations}
        className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Registrations</h1>
          <p className="text-slate-500 font-medium">Review and manage new student admission forms</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Message Notifications */}
      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm animate-in zoom-in-95 duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, ID or NRC..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>

        <div className="bg-indigo-600 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-indigo-100">
          <span className="text-white font-bold">Total Found</span>
          <span className="bg-white/20 text-white px-3 py-0.5 rounded-full font-black text-sm">{filteredRegistrations.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Student Info</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Year / Program</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Submission</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                          {reg.profile_photo_url ? (
                            <img src={reg.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                            {reg.student?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs font-bold text-slate-400 font-mono italic">
                            {reg.student?.enrollment_number || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-700">{reg.year_of_study}</p>
                      <p className="text-xs font-medium text-slate-400 italic">Faculty of {reg.major || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(reg.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(reg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setSelectedReg(reg)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200/50 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-slate-900">No registrations found</h3>
                      <p className="text-slate-500 text-sm">Try adjusting your filters or search term to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <StudentRegistrationDetailModal 
          isOpen={!!selectedReg} 
          onClose={() => setSelectedReg(null)} 
          registration={selectedReg}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
