import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { inputStyle, labelStyle } from './formStyles';

const AddressStep = () => {
  const { register } = useFormContext();

  return (
    <motion.div 
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="space-y-2 col-span-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <span>နေရပ်လိပ်စာနှင့် ဆက်သွယ်ရန်</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="col-span-2">
        <label className={labelStyle}>အမြဲတမ်းနေရပ်လိပ်စာ</label>
        <textarea {...register("address")} className={`${inputStyle} h-32 resize-none`} placeholder="အိမ်အမှတ်၊ လမ်း၊ ရပ်ကွက်၊ မြို့နယ်..." />
      </div>
      <div>
        <label className={labelStyle}>ဖုန်းနံပါတ်</label>
        <input {...register("phone")} className={inputStyle} placeholder="၀၉-xxxxxxxxx" />
      </div>
      <div>
        <label className={labelStyle}>မွေးဖွားရာဒေသ</label>
        <input {...register("pob")} className={inputStyle} />
      </div>
    </motion.div>
  );
};

export default AddressStep;
