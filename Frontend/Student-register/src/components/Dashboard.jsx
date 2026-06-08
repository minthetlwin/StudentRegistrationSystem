import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X,
  FileText,
  GraduationCap,
  Building2,
  Bell,
  CreditCard,
  Lock
} from 'lucide-react';
import Setting from './dashboardComponents/Setting';
import DormRegistrationContainer from '../containers/DormRegistrationContainer';
import DormRegisterList from './dashboardComponents/dormRegisterList';
import StudentList from './dashboardComponents/StudentList';
import InfoRegister from './dashboardComponents/studentListComponents/InfoRegister';
import StudentRegistrationList from './dashboardComponents/StudentRegistrationList';
import Notifications from './Notifications';
import PaymentContainer from '../containers/PaymentContainer';
import PaymentList from './dashboardComponents/PaymentList';
import { SkeletonDashboard } from '../shared/components/SkeletonLoaders';

export default function Dashboard({
  user,
  role,
  onLogout,
  loading = false,
  registrationStatus = 'PENDING'
}) {
  const [activeSection, setActiveSection] = useState('dorms');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return <SkeletonDashboard />;
  }

  const studentItems = [
    { id: 'info-register', label: 'Info-register', icon: User },
    { id: 'dorms', label: 'Dormitory', icon: Building2 },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'exam results', label: 'Exam Results', icon: GraduationCap },
    { id: 'setting', label: 'Settings', icon: Settings },
  ];

  const adminItems = [
    { id: 'dorms', label: 'Dorm Requests', icon: Building2 },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'registrars', label: 'Member Registration', icon: FileText },
    { id: 'students', label: 'Students', icon: User },
    { id: 'setting', label: 'Settings', icon: Settings },
  ];

  const menuItems = role === 'student' ? studentItems : adminItems;

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 overflow-hidden lg:relative lg:block ${isSidebarOpen ? 'block' : 'hidden md:hidden'}`}
      >
        <div className="h-full flex flex-col w-[280px]">
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {user?.full_name || user?.name || user?.username || 'User'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 inline-block uppercase tracking-wider mt-0.5">
                    {role}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1.5">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                Workspace
              </p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-colors ${
                      activeSection === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'
                    }`} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  {activeSection === item.id && (
                    <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
              <span className="font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 capitalize">{activeSection.replace('-', ' ')}</h1>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-4">
            {role === 'student' && <Notifications />}
            {(role === 'admin' || role === 'superadmin') && (
              <button className="p-2 rounded-full text-slate-400 hover:bg-slate-50 relative group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full border-2 border-white"></span>
              </button>
            )}
            <div className="h-6 w-[1px] bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center space-x-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.full_name || user?.name || user?.username || 'User'}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{role}</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-7xl mx-auto"
            >
              {activeSection === 'setting' && (
                <Setting user={user} role={role} />
              )}

              {role === "student" && activeSection === 'dorms' && (
                registrationStatus === 'APPROVED' ? (
                  <DormRegistrationContainer user={user} role={role} />
                ) : (
                  <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Access Locked</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">You must wait for an admin to approve your Info-register application before accessing Dormitory features.</p>
                  </div>
                )
              )}

              {role === "student" && activeSection === 'payment' && (
                registrationStatus === 'APPROVED' ? (
                  <PaymentContainer user={user} role={role} />
                ) : (
                  <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Access Locked</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">You must wait for an admin to approve your Info-register application before you can make payments.</p>
                  </div>
                )
              )}
              
              {(role === "admin" || role === "superadmin") && activeSection === 'dorms' && (
                <DormRegisterList user={user} role={role} />
              )}

              {(role === "admin" || role === "superadmin") && activeSection === 'payment' && (
                <PaymentList user={user} role={role} />
              )}
              
              {(role === "admin" || role === "superadmin") && activeSection === 'students' && (
                <StudentList user={user} role={role} />
              )}

              {(role === "admin" || role === "superadmin") && activeSection === 'registrars' && (
                <StudentRegistrationList user={user} role={role} />
              )}
              
              {role === "student" && activeSection === 'info-register' && (
                <InfoRegister user={user} role={role} onComplete={() => setActiveSection('dorms')} />
              )}

              {activeSection === 'exam results' && (
                <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Exam Results Coming Soon</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Your academic performance data is being processed and will be available once the grading period ends.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

