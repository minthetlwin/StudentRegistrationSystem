import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, HelpCircle, FileText } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'ဖောင်တင်ရန်', path: '/student/register', icon: FileText },
    { name: 'အကူအညီ', path: '/student/help', icon: HelpCircle },
    { name: 'Log in', path: '/auth/login', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/student" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-slate-900 text-lg font-semibold tracking-tight">Portal</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
