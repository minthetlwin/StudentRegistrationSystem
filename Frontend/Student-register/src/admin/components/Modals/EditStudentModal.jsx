import { useState } from 'react';

const getInitialFormData = (student, mode) => {
  if (mode === 'admitted') {
    return {
      full_name: student?.full_name || '',
      enrollment_number: student?.enrollment_number || '',
      g12_exam_id: student?.g12_exam_id || '',
      nrc: student?.nrc || '',
      date_of_birth: student?.date_of_birth
        ? new Date(student.date_of_birth).toISOString().split('T')[0]
        : '',
     
      admission_year: student?.admission_year || '',
     
    };
  }

  // current student
  return {
    full_name: student?.full_name || '',
    enrollment_number: student?.enrollment_number || '',
    g12_exam_id: student?.g12_exam_id || '',
    nrc: student?.nrc || '',
    date_of_birth: student?.date_of_birth
      ? new Date(student.date_of_birth).toISOString().split('T')[0]
      : '',
    program: student?.program || 'none',
    current_year: student?.current_year || 1,
    status: student?.status || 'REGISTERED'
  };
};

export default function EditStudentModal({ student, onClose, onSave, mode }) {
  const [formData, setFormData] = useState(getInitialFormData(student, mode));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Student</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
            <input
              type="text"
              name="enrollment_number"
              value={formData.enrollment_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NRC</label>
            <input
              type="text"
              name="nrc"
              value={formData.nrc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {mode === 'admitted' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">G12 Exam ID</label>
                <input
                  type="text"
                  name="g12_exam_id"
                  value={formData.g12_exam_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Year</label>
                <input
                  type="text"
                  name="admission_year"
                  value={formData.admission_year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
            </>
          )}

          {mode === 'current' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
                <select
                  name="current_year"
                  value={formData.current_year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="REGISTERED">Registered</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="CS">Computer Science</option>
                <option value="CT">Computer Technology</option>
              </select>
            </div>
            </>
          )}


          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
