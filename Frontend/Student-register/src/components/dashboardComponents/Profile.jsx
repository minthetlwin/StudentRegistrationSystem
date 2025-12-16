import React, { useState } from 'react';
import AddAdmin from '../adminComponents/addAdmin';
export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'password', label: 'Change Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
     { id: 'addadmin',  label: 'Add Admin',  icon: 'M18 9v6m3-3h-6M15 20h5v-2a4 4 0 00-4-4h-1M9 12a4 4 0 110-8 4 4 0 010 8zM3 20v-2a4 4 0 014-4h4'} 
 ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <div className="flex items-center space-x-6">
          
         {user?.role=="student" && (<div>
            <h1 className="text-3xl font-bold">{user?.full_name}</h1>
            <p className="text-indigo-100">Student ID: {user?.enrollment_number}</p>
            <p className="text-indigo-100 text-lg ">Status: {user?.status}</p>
          </div>)
          }
         {user?.role=="superadmin" &&(
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-indigo-100">role: {user?.role}</p>
           
          </div>
          )
          
          }
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'info' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
              
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                <label className="block text-sm font-semibold text-orange-700 mb-2">Program</label>
                <p className="text-gray-900 font-semibold text-lg">{user?.program || 'N/A'}</p>
              </div>
             
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                <label className="block text-sm font-semibold text-teal-700 mb-2">Admission Year</label>
                <p className="text-gray-900 font-semibold text-lg">{user?.admission_year || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
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

        {activeTab === 'addadmin' && user?.role ==="superadmin" &&  (
             <AddAdmin/>
        )}

      </div>
    </div>
  );
}