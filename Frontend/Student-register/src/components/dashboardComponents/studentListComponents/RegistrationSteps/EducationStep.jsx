import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { inputStyle, labelStyle } from './formStyles';

const EducationStep = () => {
  const { register } = useFormContext();

  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="space-y-2 col-span-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>ပညာရေးဆိုင်ရာ အချက်အလက်များ</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div>
        <label className={labelStyle}>သင်တန်းနှစ်</label>
        <select {...register("year_of_study", { required: true })} className={inputStyle}>
          <option value="">ရွေးချယ်ပါ</option>
          <option value="ပထမနှစ်">First Year (ပထမနှစ်)</option>
          <option value="ဒုတိယနှစ်">Second Year (ဒုတိယနှစ်)</option>
          <option value="တတိယနှစ်">Third Year (တတိယနှစ်)</option>
          <option value="စတုတ္ထနှစ်">Fourth Year (စတုတ္ထနှစ်)</option>
          <option value="ပဉ္စမနှစ်">Fifth Year (ပဉ္စမနှစ်)</option>
        </select>
      </div>
     
      <div>
        <label className={labelStyle}>အထူးပြုဘာသာ</label>
        <select {...register("major")} className={inputStyle}>
          <option value="CS">Computer Science (CS)</option>
          <option value="CT">Computer Technology (CT)</option>
          <option value="none">none</option>
        </select>
      </div>
      {/* Roll number and university registration are managed via auth data or updated by admin */}
      <div>
        <label className={labelStyle}>တက္ကသိုလ်၀င်ရောက်သည့်နှစ်</label>
        <input {...register("yr_no")} className={inputStyle} placeholder="2019-2020" />
      </div>
    </motion.div>
  );
};

export default EducationStep;
