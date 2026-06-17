import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function AdminStats({ stats = [] }) {
  // stats: [{ label: 'Pending', value: 10, icon: Clock, color: 'amber' }, ...]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card p-5 rounded-2xl relative overflow-hidden group transition-all"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center group-hover:bg-${stat.color}-100 transition-colors`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className={`absolute -bottom-2 -left-2 w-16 h-16 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
        </motion.div>
      ))}
    </div>
  );
}
