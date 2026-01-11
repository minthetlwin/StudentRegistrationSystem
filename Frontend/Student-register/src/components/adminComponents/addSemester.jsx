import { useState } from "react";
import { createSemester } from "../../services/adminServices";

export default function AddSemester() {
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    isActive: true,
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
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
        
        setFormData({
          name: "",
          academicYear: "",
          isActive: true,
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
      className="max-w-xl bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Semester</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Semester Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Semester Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Semester 1"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      {/* Academic Year */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Academic Year
        </label>
        <input
          type="text"
          name="academicYear"
          placeholder="e.g. 2024–2025"
          value={formData.academicYear}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Active Status */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Set as Active Semester</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Semester'}
      </button>
    </form>
  );
}
