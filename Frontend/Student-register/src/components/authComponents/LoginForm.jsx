import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Hash } from 'lucide-react';

import { Calendar } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card w-full max-w-md mx-auto p-10 rounded-3xl"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-6">

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            NRC Number
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <span className="text-[10px] font-bold">NRC</span>
            </div>
            <input
              {...register("nrc", { 
                required: "NRC number is required" 
              })}
              type="text"
              className="input-field pl-11"
              placeholder="12/ABC(N)123456"
              disabled={loading}
            />
          </div>
          {errors.nrc && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.nrc.message}</p>}
        </div>

         <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">မွေးသက္ကရာဇ်</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  {...register("date_of_birth", { required: "လိုအပ်သည်" })}
                  type="date"
                  className="input-field pl-11"
                  disabled={loading}
                />
              </div>
              {errors.date_of_birth && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.date_of_birth.message}</p>}
            </div>

        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              {...register("password", { 
                required: "Password is required" 
              })}
              type={showPassword ? "text" : "password"}
              className="input-field pl-11 pr-12"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Signing in...</span>
              </span>
            ) : 'Sign In'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}