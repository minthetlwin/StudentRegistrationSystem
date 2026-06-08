import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main>
        {/* Import and use the existing Home component */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Student Portal</h1>
              <p className="text-lg text-slate-600 mb-8">
                Manage your academic registration, dormitory assignments, and payments in one place.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Link to="" className="hover:shadow-lg transition-shadow">
                  <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2">Register</h3>
                    <p className="text-sm text-indigo-700">Complete your registration and verify your account</p>
                  </div>
                </Link>
                <Link to="" className="hover:shadow-lg transition-shadow">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2">Dormitory</h3>
                    <p className="text-sm text-blue-700">Apply for dormitory accommodation</p>
                  </div>
                </Link>
                <Link to="" className="hover:shadow-lg transition-shadow">
                  <div className="p-6 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100">
                    <h3 className="font-bold text-purple-900 mb-2">Payment</h3>
                    <p className="text-sm text-purple-700">Make and track your payments</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
