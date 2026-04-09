import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, FileText, Home, Loader2, Sparkles, Building2 } from "lucide-react";

export default function DormRegisterForm({ onSubmit, loading = false, shouldReset = false }) {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: "onChange"
  });

  // Reset form when shouldReset prop changes to true
  useEffect(() => {
    if (shouldReset) {
      reset();
    }
  }, [shouldReset, reset]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }, []);

  const onValid = (data) => {
    const payload = {
      ...data,
      studentId: user?.g12_exam_id || user?._id || user?.id, 
    };
    if (onSubmit) {
      onSubmit(payload);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Decorative Header */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="absolute -top-12 -right-12 text-white/10">
          <Building2 size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Dormitory Registration</h2>
          </div>
          <p className="text-indigo-100 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Apply for your campus accommodation
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8 border border-t-0 border-gray-100">
        <form onSubmit={handleSubmit(onValid)} className="space-y-6">
          <div className="space-y-5">
            {/* Address Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                Permanent Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                {...register("address", { required: "Address is required" })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900 shadow-sm
                  ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500'}`}
                placeholder="Enter your full home address"
                disabled={loading}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.address.message}</p>
              )}
            </div>

            {/* Emergency Contact Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                Emergency Contact <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                {...register("emergencyContact", { 
                  required: "Emergency contact is required",
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900 shadow-sm
                  ${errors.emergencyContact ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500'}`}
                placeholder="+95 9..."
                disabled={loading}
              />
              {errors.emergencyContact && (
                <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.emergencyContact.message}</p>
              )}
            </div>

            {/* Reason Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                Reason for Accommodation <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register("reason", { 
                  required: "Please provide a reason for your application",
                  minLength: {
                    value: 10,
                    message: "Reason must be at least 10 characters"
                  }
                })}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900 shadow-sm resize-none
                  ${errors.reason ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500'}`}
                placeholder="Please explain why you need campus accommodation..."
                disabled={loading}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.reason.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-4 text-center">
              All fields marked with <span className="text-red-500">*</span> must be filled to submit your application.
            </p>
            
            <button 
              type="submit" 
              disabled={loading || !isValid}
              className={`w-full group relative flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 overflow-hidden
                ${loading || !isValid 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
                }`}
            >
               {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg className={`ml-2 w-5 h-5 transition-transform duration-300 ${isValid ? 'group-hover:translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
