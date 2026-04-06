import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, BarChart3, LogOut, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'results', label: 'Results', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Student</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Main Menu
        </p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 transition-colors ${
                activeSection === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'
              }`} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {activeSection === item.id && (
              <motion.div layoutId="active-indicator">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

