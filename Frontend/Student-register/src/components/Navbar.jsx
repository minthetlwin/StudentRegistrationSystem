import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-gray-900 text-lg font-semibold tracking-tight">Student Registration</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/results" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
              အောင်စာရင်း
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
              ဖောင်တင်ရန်
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
              အကူအညီ
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
              About Us
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}