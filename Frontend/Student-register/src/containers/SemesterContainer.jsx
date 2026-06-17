import React, { useState, useEffect } from 'react';
import AddSemester from '../components/dashboardComponents/AddSemesters'; // Adjust path based on your folders
import { getSemesters, toggleSemesterStatus } from '../services/adminServices'; 
import { RefreshCw, CheckCircle, Circle, Lock, Unlock } from 'lucide-react';

export default function SemesterContainer() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadSemesters = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await getSemesters(); 
    
  
    
    // This condition might be failing due to unexpected nesting or interceptors
    if (response.data && response.data.success) {
      setSemesters(response.data.data);
    } else if (response.success && response.data) {
      // 🔥 If your log shows an interceptor is active, this fallback fixes it:
      setSemesters(response.data);
    }
  } catch (err) {
    console.error("❌ API Request Crashed:", err);
    setError("Failed to fetch semester configurations.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSemesters();
  }, []);

  const handleToggle = async (id, updatedFields) => {
    try {
      // updatedFields will look like: { isActive: true } or { isPaymentOpen: false }
      const res = await toggleSemesterStatus(id, updatedFields);
      if (res.success) {
        // Reload all data to ensure the backend clash protection propagates to state accurately
        await loadSemesters(); 
      }
    } catch (err) {
      setError("Failed to update semester status variables.");
    }
  };

  const getStatusColor = (sem) => {
    if (sem.isActive) return 'emerald';
    return 'slate';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
        <button 
          onClick={loadSemesters} 
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold text-[11px] hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          SYNC
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Add Form */}
        <div className="lg:col-span-1">
          <AddSemester onRefresh={loadSemesters} />
        </div>

        {/* Right side: List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active & Past Sessions</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{semesters.length} Total</span>
          </div>

          <div className="space-y-4">
            {semesters.map((sem) => (
              <div 
                key={sem._id} 
                className={`glass-card p-6 rounded-[32px] transition-all relative overflow-hidden group ${
                  sem.isActive ? 'ring-2 ring-indigo-500/20 bg-indigo-50/10' : ''
                }`}
              >
                {sem.isActive && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-bl-2xl uppercase tracking-widest animate-pulse">
                    Currently Active
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-${getStatusColor(sem)}-50`}>
                        <RefreshCw className={`w-5 h-5 text-${getStatusColor(sem)}-600`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{sem.name}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{sem.academicYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-1">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-slate-400 uppercase">Starts</span>
                         <span className="text-xs font-bold text-slate-600">{new Date(sem.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                       <div className="w-4 h-[1px] bg-slate-200 mt-3" />
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-slate-400 uppercase">Ends</span>
                         <span className="text-xs font-bold text-slate-600">{new Date(sem.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3 bg-white/50 p-2 rounded-2xl border border-slate-100/50">
                    {/* Active Toggle */}
                    <button
                      onClick={() => !sem.isActive && handleToggle(sem._id, { isActive: true })}
                      disabled={sem.isActive}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        sem.isActive 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sem.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                      {sem.isActive ? 'ACTIVE SESSION' : 'SET AS ACTIVE'}
                    </button>

                    <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />

                    {/* Dorm Window Switch */}
                    <button
                      onClick={() => handleToggle(sem._id, { isRegistrationOpen: !sem.isRegistrationOpen })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        sem.isRegistrationOpen 
                          ? 'bg-sky-50 text-sky-700 border border-sky-100' 
                          : 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60'
                      }`}
                    >
                      {sem.isRegistrationOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      DORM REQ
                    </button>

                    {/* Payment Toggle */}
                    <button
                      onClick={() => handleToggle(sem._id, { isPaymentOpen: !sem.isPaymentOpen })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        sem.isPaymentOpen 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                          : 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60'
                      }`}
                    >
                      {sem.isPaymentOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      PAYMENTS
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {semesters.length === 0 && !loading && (
              <div className="glass-card p-12 rounded-[40px] text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No academic sessions found</p>
                <p className="text-xs text-slate-300 mt-1">Add your first semester using the form on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}