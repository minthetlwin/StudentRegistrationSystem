import { useState, useEffect } from 'react';
import { getStudentRegistrations, updateStudentRegistrationStatus } from '../../services/adminServices';
import StudentRegistrationDetailModal from '../adminComponents/StudentRegistrationDetailModal';
import AdminStats from '../adminComponents/AdminStats';
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

  const getStats = () => [
    { label: 'Total Applications', value: registrations.length, icon: User, color: 'indigo' },
    { label: 'Pending Review', value: registrations.filter(r => r.status === 'PENDING').length, icon: Clock, color: 'amber' },
    { label: 'Approved', value: registrations.filter(r => r.status === 'APPROVED').length, icon: CheckCircle, color: 'emerald' },
    { label: 'Rejected', value: registrations.filter(r => r.status === 'REJECTED').length, icon: XCircle, color: 'rose' },
  ];

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
        reg.student?.nrc?.toLowerCase().includes(lowerSearch)
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            EXPORT
          </button>
        </div>
      </div>

      <AdminStats stats={getStats()} />

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, ID or NRC..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium text-slate-900"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>

        <div className="bg-indigo-600 rounded-xl px-5 py-2.5 flex items-center justify-between">
          <span className="text-white font-bold text-xs uppercase tracking-wider">Total Match</span>
          <span className="bg-white/20 text-white px-3 py-0.5 rounded-lg font-black text-xs">{filteredRegistrations.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Identity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Year / Program</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Semester</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Submission</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {reg.profile_photo_url ? (
                            <img src={reg.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[180px]">
                            {reg.student?.full_name || 'Unknown'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">
                            {reg.student?.enrollment_number || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{reg.year_of_study}</p>
                      <p className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">Faculty of {reg.major || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-indigo-600">{reg.semester?.name || 'N/A'}</p>
                      <p className="text-[9px] font-bold text-slate-400">{reg.semester?.academicYear || ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">
                        {new Date(reg.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(reg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setSelectedReg(reg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[11px] hover:bg-slate-800 transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          REVIEW
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
