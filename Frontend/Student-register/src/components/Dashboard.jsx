import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, secondsToMilliseconds } from 'framer-motion';
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
  Lock,
  BookAIcon,
  Clock,
  CheckCircle 
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
import { SkeletonDashboard } from './SkeletonLoaders';
import SemesterContainer from '../containers/SemesterContainer';

export default function Dashboard({
  user,
  role,
  onLogout,
  loading = false,
  registrationStatus = 'PENDING',
  registrationExists = false,
  isRegistrationOpen = false,
  isPaymentOpen = false
}) {
  const [activeSection, setActiveSection] = useState(role === 'student' && !registrationExists ? 'info-register' : 'dorms');
  
  useEffect(() => {
    if (role === 'student' && !registrationExists) {
      setActiveSection('info-register');
    }
  }, [registrationExists, role]);
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
    { id: 'semesters', label: 'Manage Semesters', icon: LayoutDashboard },
    { id: 'setting', label: 'Settings', icon: Settings },
  ];

  const menuItems = role === 'student' ? studentItems : adminItems;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
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
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">
                    {user?.full_name || user?.name || user?.username || 'User'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 border border-slate-100 rounded px-1.5 py-0.5 inline-block uppercase tracking-wider mt-1">
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

            <nav className="space-y-1">

              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-4.5 h-4.5 transition-colors ${
                      activeSection === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'
                    }`} />
                    <span className="font-bold text-[13px]">{item.label}</span>
                  </div>
                  {activeSection === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
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
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {activeSection === 'registrars' ? 'Member Registration' : 
               activeSection === 'dorms' ? 'Dormitory Requests' : 
               activeSection === 'payment' ? 'Fee Management' :
               activeSection === 'semesters' ? 'Semester Control' :
               activeSection.replace('-', ' ')}
            </h1>
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
              {role === 'student' && !registrationExists && activeSection !== 'info-register' && (
                <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Complete Your Registration</p>
                      <p className="text-xs text-slate-500">Please fill out your info-register form to unlock all features.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSection('info-register')}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Go to Form
                  </button>
                </div>
              )}

              {activeSection === 'setting' && (
                <Setting user={user} role={role} />
              )}

              {role === "student" && activeSection === 'dorms' && (
                !isRegistrationOpen ? (
                  <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                    <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-sky-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Dormitory Window Closed</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Dormitory applications are currently closed for this semester. Please wait for the registration period to officially begin.</p>
                  </div>
                ) : (
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
                )
              )}

              {role === "student" && activeSection === 'info-register' && (
                registrationExists && registrationStatus !== 'REJECTED' ? (
                  <div className="glass-card p-12 rounded-[40px] text-center space-y-6 max-w-2xl mx-auto">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                      registrationStatus === 'APPROVED' ? 'bg-emerald-50' : 'bg-amber-50'
                    }`}>
                      {registrationStatus === 'APPROVED' ? (
                         <CheckCircle className="w-10 h-10 text-emerald-500" />
                      ) : (
                         <Clock className="w-10 h-10 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        {registrationStatus === 'APPROVED' ? 'Registration Approved' : 'Registration Submitted'}
                      </h3>
                      <p className="text-slate-500 font-medium mt-2">
                        {registrationStatus === 'APPROVED' 
                          ? 'Your registration has been approved by the admin. You can now proceed to payment and dormitory requests.' 
                          : 'Your registration is currently being reviewed by the administration. Please check back later.'}
                      </p>
                    </div>
                  </div>
                ) : (
                   <div className="glass-card p-8 md:p-10 rounded-3xl">
                     <InfoRegister 
                       user={user} 
                       role={role} 
                       onComplete={() => setActiveSection('dorms')} 
                     />
                   </div>
                )
              )}

              {role === "student" && activeSection === 'payment' && (
                !isPaymentOpen ? (
                  <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Payment Window Closed</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Fee payment is currently disabled. Please wait for the official payment window to open.</p>
                  </div>
                ) : (
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

             {(role === "admin" || role === "superadmin") && activeSection === 'semesters' && (
  <SemesterContainer user={user} role={role} />
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

