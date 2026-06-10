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
    
    // 🔍 ADD THIS LOG HERE:
    console.log("👉 EXACT RESPONSE RECEIVED BY COMPONENT:", response);
    
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left side: Add Form */}
      <div className="xl:col-span-1">
        <AddSemester onRefresh={loadSemesters} />
      </div>

      {/* Right side: Management Grid Dashboard */}
      <div className="xl:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Manage Semester Timelines</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control active sessions, registration, and payment gates.</p>
          </div>
          <button 
            onClick={loadSemesters} 
            className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl">{error}</div>}

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {semesters.map((sem) => (
            <div 
              key={sem._id} 
              className={`p-4 border rounded-2xl transition-all ${
                sem.isActive 
                  ? 'border-indigo-200 bg-indigo-50/40 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800">{sem.name}</h4>
                    <span className="text-[10px] bg-slate-200/60 font-bold text-slate-600 px-2 py-0.5 rounded-md uppercase">
                      {sem.academicYear}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Duration: {new Date(sem.startDate).toLocaleDateString()} - {new Date(sem.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Toggles Panel */}
                <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                  
                  {/* Global Activation Toggle */}
                  <button
                    onClick={() => !sem.isActive && handleToggle(sem._id, { isActive: true })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      sem.isActive 
                        ? 'bg-emerald-600 text-white border-transparent' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sem.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    {sem.isActive ? 'Active' : 'Set Active'}
                  </button>

                  {/* Registration Window Switch */}
                  <button
                    onClick={() => handleToggle(sem._id, { isRegistrationOpen: !sem.isRegistrationOpen })}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                      sem.isRegistrationOpen 
                        ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle Student Info Registration Window"
                  >
                    {sem.isRegistrationOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Reg</span>
                  </button>

                  {/* Payment Window Switch */}
                  <button
                    onClick={() => handleToggle(sem._id, { isPaymentOpen: !sem.isPaymentOpen })}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                      sem.isPaymentOpen 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle Student Fee Payment Window"
                  >
                    {sem.isPaymentOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Pay</span>
                  </button>

                </div>
              </div>
            </div>
          ))}
          {semesters.length === 0 && !loading && (
            <p className="text-center text-sm text-slate-400 py-6">No semesters created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}