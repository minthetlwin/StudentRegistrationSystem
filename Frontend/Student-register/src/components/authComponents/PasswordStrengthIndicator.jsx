import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

const PasswordStrengthIndicator = ({ password = "" }) => {
  const requirements = useMemo(() => [
    { label: "Minimum 8 characters", test: (p) => p.length >= 8 },
    { label: "At least one uppercase (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "At least one lowercase (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "At least one number (0-9)", test: (p) => /[0-9]/.test(p) },
    { label: "At least one special char (!@#$%)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ], []);

  const metCount = requirements.filter(req => req.test(password)).length;
  const strength = Math.floor((metCount / requirements.length) * 100);

  const getStrengthMeta = () => {
    if (metCount === 0) return { label: "Empty", color: "bg-slate-200", text: "text-slate-400", icon: Shield };
    if (metCount < 3) return { label: "Weak", color: "bg-rose-500", text: "text-rose-500", icon: ShieldAlert };
    if (metCount < 5) return { label: "Medium", color: "bg-amber-500", text: "text-amber-500", icon: Shield };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500", icon: ShieldCheck };
  };

  const meta = getStrengthMeta();

  return (
    <div className="space-y-4 mt-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Password Strength: <span className={meta.text}>{meta.label}</span>
        </label>
        <meta.icon className={`w-4 h-4 ${meta.text} transition-colors duration-300`} />
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${meta.color}`}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-2">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <div key={index} className="flex items-center gap-2">
              <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${isMet ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                {isMet ? (
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                ) : (
                  <X className="w-2.5 h-2.5 text-slate-400" />
                )}
              </div>
              <span className={`text-[11px] font-medium transition-colors duration-300 ${isMet ? 'text-emerald-700' : 'text-slate-500'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
