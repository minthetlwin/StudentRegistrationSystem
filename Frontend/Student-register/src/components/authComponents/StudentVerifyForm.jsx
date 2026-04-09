import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { UserCheck, Hash, CreditCard, Calendar, ClipboardCheck } from "lucide-react";

export default function StudentVerifyForm({ onVerify }) {
  const { register, handleSubmit, formState: { errors ,isSubmitting } } = useForm();

  const onValid = (data) => {
    if (onVerify) {
      onVerify(data);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-8 md:p-12 rounded-3xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <UserCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">ကျောင်းသား အကောင့် စစ်ဆေးခြင်း</h2>
          <p className="text-slate-500 text-sm">ကျောင်းသားအချက်အလက်များကို ဖြည့်သွင်း၍ စစ်ဆေးပေးပါ</p>
        </div>
        
        <form onSubmit={handleSubmit(onValid)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NRC Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">မှတ်ပုံတင်နံပတ်</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  {...register("nrcNumber", { required: "လိုအပ်သည်" })}
                  type="text"
                  className="input-field pl-11"
                  placeholder="12/ABC(N)123456"
                />
              </div>
              {errors.nrcNumber && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.nrcNumber.message}</p>}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">မွေးသက္ကရာဇ်</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  {...register("dateOfBirth", { required: "လိုအပ်သည်" })}
                  type="date"
                  className="input-field pl-11"
                />
              </div>
              {errors.dateOfBirth && <p className="text-[11px] text-rose-500 ml-1 font-medium italic">{errors.dateOfBirth.message}</p>}
            </div>

            {/* G12 Exam ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">G12 Exam ID </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <input
                  {...register("g12ExamId", { required: "လိုအပ်သည်" })}
                  type="text"
                  className="input-field pl-11"
                  placeholder="Exam ID (Optional)"
                />
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="pt-4"
          >
            <button
              type="submit"
              className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-indigo-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Student'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

