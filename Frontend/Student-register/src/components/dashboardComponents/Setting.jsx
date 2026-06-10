import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  UserPlus, 
  PlusCircle, 
  CheckCircle2, 
  Shield, 
  BookOpen, 
  Calendar,
  CreditCard
} from 'lucide-react';
import AddAdmin from './settingComponents/addAdmin';

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState(user?.role === 'student' ? 'info' : 'password');

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'addadmin', label: 'Add Admin', icon: UserPlus },
  ];

  const roleTabsMap = {
    student: ['info', 'password'],
    admin: ['info', 'password'],
    superadmin: ['password', 'addadmin']
  };

  const availableTabs = tabs.filter(tab =>
    roleTabsMap[user?.role]?.includes(tab.id)
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="glass-card p-8 rounded-3xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Shield className="w-32 h-32 text-indigo-600" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 relative z-10">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {user?.full_name || user?.name || 'Account Settings'}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {user?.role}
              </span>
              {user?.enrollment_number && (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  ID: {user.enrollment_number}
                </span>
              )}
              {user?.status && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {user.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-3 rounded-3xl space-y-1">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-bold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glass-card p-8 md:p-10 rounded-3xl"
            >
              {activeTab === 'info' && user?.role === 'student' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Personal Dashboard</h2>
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Current Program</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{user?.program || 'N/A'}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Entry Year</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{user?.admission_year || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Update Password</h2>
                    <Lock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <form className="space-y-5 max-w-md" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="btn-primary w-full py-3.5 font-bold">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'addadmin' && user?.role === "superadmin" && (
                <AddAdmin />
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}