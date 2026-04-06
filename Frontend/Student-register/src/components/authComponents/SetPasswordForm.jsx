import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function SetPasswordForm({ onSetPassword }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("new_password");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card w-full max-w-md mx-auto p-10 rounded-3xl"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Secure Account</h2>
        <p className="text-slate-500 text-sm">Create a strong password for your portal</p>
      </div>

      <form onSubmit={handleSubmit(onSetPassword)} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              {...register("new_password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              type={showPassword ? "text" : "password"}
              className="input-field pl-11 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.new_password && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.new_password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              {...register("confirm_password", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              type={showConfirmPassword ? "text" : "password"}
              className="input-field pl-11 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.confirm_password.message}</p>}
        </div>

        <div className="pt-2">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-indigo-100"
          >
            Create Password
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

