import React, { useState } from 'react';
import Profile from './dashboardComponents/Profile';
import DormRegistrationContainer from '../containers/DormRegistrationContainer';
import DormRegisterList from './adminComponents/DormRegisterList';

export default function Dashboard({
  user,
  role,
  onLogout,
  loading = false
}) {
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


  const studentItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0'
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: 'M9 12h6m-6 4h6M4.5 6.75A2.25 2.25 0 016.75 4.5h6.19a2.25 2.25 0 011.59.66l3.81 3.81a2.25 2.25 0 01.66 1.59v6.69A2.25 2.25 0 0116.5 19.5h-9a2.25 2.25 0 01-2.25-2.25V6.75z'
    },
    {
      id: 'results',
      label: 'Exam Results',
      icon: 'M3 3v18h18M9 17v-6m4 6V7m4 10v-4'
    }
  ];

const adminItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0'
  },
  {
    id: 'students',
    label: 'Students',
    icon: 'M18 18.75v-1.5a4.5 4.5 0 00-4.5-4.5h-3a4.5 4.5 0 00-4.5 4.5v1.5M12 6.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z'
  },
  {
    id: 'admins',
    label: 'Admins',
    icon: 'M16.5 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM3.75 20.25a6.75 6.75 0 0113.5 0'
  },
  {
    id: 'dorms',
    label: 'Dorms',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
  }
];

  const sidebarItems = [
    ...(role === 'student' ? studentItems : adminItems),
    {
      id: 'logout',
      label: 'Logout',
      icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3',
      danger: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <p className="text-indigo-100 text-lg">
            {role === 'student' ? 'Student Portal' : 'Admin Portal'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.id === 'logout'
                  ? onLogout()
                  : setActiveSection(item.id)
              }
              className={`w-full flex items-center px-4 py-4 mb-2 text-left rounded-xl transition-all
                ${item.danger
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gray-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d={item.icon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeSection === 'profile' && (
          <Profile user={user} role={role} />
        )}
        
        {activeSection === 'forms' && (
          <DormRegistrationContainer user={user} role={role} />
        )}
        {activeSection === 'dorms' && (
          <DormRegisterList user={user} role={role} />
        )}
      </div>
    </div>
  );
}
