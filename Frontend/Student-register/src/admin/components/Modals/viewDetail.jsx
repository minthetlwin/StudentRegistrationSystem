import React from "react";

export default function viewDetail({
  open,
  onClose,
  studentData,
  onStatusUpdate,
  onEdit,
  onDelete
}) {
  if (!open) return null;

  const isDorm = studentData?.student || studentData?.semester;
  const isNewAdmitted = studentData?.g12_exam_id;
  const isCurrent = studentData?.enrollment_number && !isNewAdmitted;

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "border-gray-400 text-gray-700";
      case "APPROVED": return "border-green-500 text-green-700 bg-green-50";
      case "REJECTED": return "border-red-500 text-red-700 bg-red-50";
      case "REGISTERED": return "border-emerald-500 text-emerald-700 bg-emerald-50";
      case "SUSPENDED": return "border-amber-500 text-amber-700 bg-amber-50";
      case "TRANSFERRED": return "border-slate-400 text-slate-600 bg-slate-50";
      case "LEFT": return "border-rose-400 text-rose-600 bg-rose-50";
      case "GRADUATED": return "border-indigo-500 text-indigo-700 bg-indigo-50";
      case "BLOCKED": return "border-black text-black bg-gray-100";
      default: return "border-gray-400 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDorm ? "Dorm Registration" : "Student Details"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {isDorm ? studentData?.student?.full_name : studentData?.full_name}
              </p>
            </div>

            {isDorm && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                  <p className="text-gray-900">{studentData?.student?.enrollment_number}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <p className="text-gray-900">{studentData?.semester?.name} - {studentData?.semester?.academicYear}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{studentData?.address}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <p className="text-gray-900">{studentData?.emergencyContact}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Accommodation</label>
                  <p className="text-gray-900">{studentData?.reason}</p>
                </div>
              </>
            )}

            {isNewAdmitted && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade 12 Exam ID</label>
                  <p className="text-gray-900">{studentData?.g12_exam_id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Year</label>
                  <p className="text-gray-900">{studentData?.admission_year}</p>
                </div>
              </>
            )}

            {isCurrent && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                  <p className="text-gray-900">{studentData?.enrollment_number}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <p className="text-gray-900">{studentData?.current_year || 'N/A'}</p>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(studentData?.status)}`}>
                  {studentData?.status || 'Active'}
                </span>
                {studentData?.reviewedBy && (
                  <p className="text-xs text-gray-500 mt-1">Reviewed by: {studentData.reviewedBy.name}</p>
                )}
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">{isDorm ? 'Registered' : 'Enrolled'}</label>
                <p className="text-sm ">
                  {studentData?.createdAt && new Date(studentData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
          {isDorm && studentData?.status === "PENDING" && onStatusUpdate && (
            <>
              <button
                onClick={() => onStatusUpdate("APPROVED")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate("REJECTED")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {!isDorm && onEdit && (
            <button
              onClick={() => onEdit(studentData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Edit
            </button>
          )}
          {!isDorm && onDelete && (
            <button
              onClick={() => onDelete(studentData)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
