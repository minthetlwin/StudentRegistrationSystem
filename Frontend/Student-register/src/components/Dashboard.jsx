import React, { useState } from 'react';

export default function Dashboard({ student, onLogout, loading = false }) {
  const [activeSection, setActiveSection] = useState('profile');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'password', label: 'Change Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'forms', label: 'Form Filling', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'results', label: 'Exam Results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Portal</h1>
              <p className="text-indigo-100 text-sm">{student?.full_name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-4 mb-2 text-left rounded-xl transition-all duration-200 ${
                activeSection === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                activeSection === item.id ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-8 left-4 right-4">
          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Notification Bar */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 m-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-800 font-semibold">Payment Reminder</p>
              <p className="text-amber-700 text-sm">University fees payment deadline is approaching. Please complete your payment.</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <label className="block text-sm font-semibold text-blue-700 mb-2">Full Name</label>
                  <p className="text-gray-900 font-semibold text-lg">{student?.full_name}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <label className="block text-sm font-semibold text-green-700 mb-2">Enrollment Number</label>
                  <p className="text-gray-900 font-semibold text-lg">{student?.enrollment_number}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-700 mb-2">NRC</label>
                  <p className="text-gray-900 font-semibold text-lg">{student?.nrc}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                  <label className="block text-sm font-semibold text-orange-700 mb-2">Program</label>
                  <p className="text-gray-900 font-semibold text-lg">{student?.program || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Change Password</h2>
              <form className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Current Password</label>
                  <input type="password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
                  <input type="password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeSection === 'forms' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Forms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Course Registration</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Register for upcoming semester courses</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Fill Form →
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Scholarship Application</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Apply for available scholarships</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Fill Form →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'results' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Exam Results</h2>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Credits</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">Mathematics</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-green-100 text-green-800">A</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">3</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Fall 2024</td>
                      </tr>
                      <tr className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">Physics</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-blue-100 text-blue-800">B+</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">4</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Fall 2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}