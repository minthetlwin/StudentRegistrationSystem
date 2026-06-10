import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function LoginForm({ onLogin, loading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onValid = (data) => {
    if (onLogin) {
      onLogin(data);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card w-full max-w-md mx-auto p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="text-center mb-10 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h2>
        <p className="text-slate-500 text-sm font-medium">Secure access for authorized administrators</p>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-6 relative z-10">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            Official Email
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              className="input-field pl-11 group-hover:border-slate-300 transition-all"
              placeholder="admin@university.edu"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] text-rose-500 ml-1 font-medium italic"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            Secret Key
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              {...register("password", { 
                required: "Password is required" 
              })}
              type={showPassword ? "text" : "password"}
              className="input-field pl-11 pr-12 group-hover:border-slate-300 transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-2"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] text-rose-500 ml-1 font-medium italic"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="pt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-sm font-bold shadow-xl shadow-indigo-100 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 group-hover:opacity-90 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Access</span>
                </>
              )}
            </span>
          </motion.button>
        </div>
      </form>

      {/* Footer hint */}
      <p className="text-center mt-8 text-[11px] text-slate-400 font-medium">
        IP Address logged for security purposes
      </p>
    </motion.div>
  );
}