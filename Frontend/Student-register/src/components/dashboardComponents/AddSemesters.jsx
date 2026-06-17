import { useState } from "react";
import { createSemester } from "../../services/adminServices";

export default function AddSemester({ onRefresh }) {
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    isActive: false, 
    isRegistrationOpen: false, 
    isPaymentOpen: false,      
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const data = await createSemester(formData);
      
      if (data.success) {
        setMessage('Semester created successfully!');
        
        // 🔥 NEW: Instantly trigger the container to refresh its data list 
        if (onRefresh) {
          onRefresh();
        }
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
        
        setFormData({
          name: "",
          academicYear: "",
          isActive: false,
          isRegistrationOpen: false,
          isPaymentOpen: false,
          startDate: "",
          endDate: "",
        });
      } else {
        setMessage(data.message || 'Failed to create semester');
      }
    } catch (error) {
      setMessage(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-5"
    >
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Add New Session</h2>
        <p className="text-xs font-medium text-slate-500">Initialize a new academic semester</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs border font-medium animate-in zoom-in-95 duration-200 ${
            message.includes('success')
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Semester Name */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight">
          Semester Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. First Year - Semester 1"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Academic Year */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight">
          Academic Year
        </label>
        <input
          type="text"
          name="academicYear"
          placeholder="e.g. 2025–2026"
          value={formData.academicYear}
          onChange={handleChange}
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Dates Selection */}
      <div className="space-y-4 pt-2 border-t border-slate-100/60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline Configuration</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Window Configurations</p>
        
        {/* Active Status */}
        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">Set as Active Semester</p>
            <p className="text-xs text-slate-500">Make this the current active semester immediately across the system.</p>
          </div>
        </label>

        {/* Dormitory Window */}
        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            name="isRegistrationOpen"
            checked={formData.isRegistrationOpen}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">Open Dormitory Portal</p>
            <p className="text-xs text-slate-500">Allow students to submit dormitory applications for this semester.</p>
          </div>
        </label>

        {/* Payment Window */}
        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            name="isPaymentOpen"
            checked={formData.isPaymentOpen}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">Open Payment Portal</p>
            <p className="text-xs text-slate-500">Allow students to upload bank payment slips for fees instantly.</p>
          </div>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-100"
      >
        {loading ? 'Saving Semester...' : 'Save Semester'}
      </button>
    </form>
  );
}