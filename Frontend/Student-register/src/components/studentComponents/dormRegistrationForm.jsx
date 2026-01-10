import React from "react";
import { useForm } from "react-hook-form";

export default function DormRegisterForm({ onSubmit, loading = false, shouldReset = false }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Reset form when shouldReset prop changes to true
  React.useEffect(() => {
    if (shouldReset) {
      reset();
    }
  }, [shouldReset, reset]);


  
  const userDate = localStorage.getItem('user');

  const onValid = (data) => {
     const payload = {
    ...data,
    studentId: userDate?.g12_exam_id, 
  };
    if (onSubmit) {
      onSubmit(payload);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Dorm Registration</h2>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            {...register("address", { required: "Address required" })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Home address"
            disabled={loading}
          />
          {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
          <input
            {...register("emergencyContact", { required: "Contact required" })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Phone number"
            disabled={loading}
          />
          {errors.emergencyContact && <p className="text-xs text-red-600">{errors.emergencyContact.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            {...register("reason", { required: "Reason required" })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Why do you need accommodation?"
            disabled={loading}
          />
          {errors.reason && <p className="text-xs text-red-600">{errors.reason.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
