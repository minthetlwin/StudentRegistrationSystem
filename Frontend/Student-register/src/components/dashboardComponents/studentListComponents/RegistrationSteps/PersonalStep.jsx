import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { inputStyle, labelStyle } from './formStyles';

const PersonalStep = () => {
  const { register } = useFormContext();

  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="space-y-2 col-span-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>ကိုယ်ရေးအချက်အလက်များ</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="col-span-2 space-y-4">
        {/* Student Info */}
        <h4 className="font-bold text-indigo-600 text-sm border-b pb-2">ကျောင်းသား/သူ အချက်အလက်</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>အမည် (မြန်မာ)</label>
            <input {...register("name_mm", { required: true })} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>အမည် (အင်္ဂလိပ်)</label>
            <input {...register("name_en", { required: true })} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>လူမျိုး</label>
            <input {...register("race")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>ကိုးကွယ်သည့်ဘာသာ</label>
            <input {...register("religion")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မွေးဖွားရာဇာတိ</label>
            <input {...register("birth_place")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မြို့နယ်/ပြည်နယ်/တိုင်း</label>
            <input {...register("state_division")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မှတ်ပုံတင်အမှတ်</label>
            <input {...register("nrc", { required: true })} className={inputStyle} placeholder="၉/မရတ(နိုင်)၁၂၃၄၅၆" />
          </div>
          <div>
            <label className={labelStyle}>နိုင်ငံခြားသား</label>
            <select {...register("nationality")} className={inputStyle} >
              <option value="တိုင်းရင်းသား">တိုင်းရင်းသား</option>
              <option value="နိုင်ငံခြားသား">နိုင်ငံခြားသား</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>မွေးသက္ကရာဇ်</label>
            <input type="date" {...register("dob", { required: true })} className={inputStyle} />
          </div>
        </div>

        {/* Father Info */}
        <h4 className="font-bold text-indigo-600 text-sm border-b pb-2 mt-6">ဖခင် အချက်အလက်</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>ဖခင်အမည်</label>
            <input {...register("father_name")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>ဖခင်အမည် (အင်္ဂလိပ်)</label>
            <input {...register("father_name_en", { required: true })} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>လူမျိုး</label>
            <input {...register("father_race")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>ကိုးကွယ်သည့်ဘာသာ</label>
            <input {...register("father_religion")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မွေးဖွားရာဇာတိ</label>
            <input {...register("father_birth_place")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မြို့နယ်/ပြည်နယ်/တိုင်း</label>
            <input {...register("father_state_division")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မှတ်ပုံတင်အမှတ်</label>
            <input {...register("father_nrc")} className={inputStyle} />
          </div>
           <div>
            <label className={labelStyle}>နိုင်ငံခြားသား</label>
            <select {...register("father_nationality")} className={inputStyle} >
              <option value="တိုင်းရင်းသား">တိုင်းရင်းသား</option>
              <option value="နိုင်ငံခြားသား">နိုင်ငံခြားသား</option>
            </select>
          </div>
        </div>

        {/* Mother Info */}
        <h4 className="font-bold text-indigo-600 text-sm border-b pb-2 mt-6">မိခင် အချက်အလက်</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>မိခင်အမည်</label>
            <input {...register("mother_name")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မိခင်အမည် (အင်္ဂလိပ်)</label>
            <input {...register("mother_name_en")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>လူမျိုး</label>
            <input {...register("mother_race")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>ကိုးကွယ်သည့်ဘာသာ</label>
            <input {...register("mother_religion")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မွေးဖွားရာဇာတိ</label>
            <input {...register("mother_birth_place")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မြို့နယ်/ပြည်နယ်/တိုင်း</label>
            <input {...register("mother_state_division")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>မှတ်ပုံတင်အမှတ်</label>
            <input {...register("mother_nrc")} className={inputStyle} />
          </div>
           <div>
            <label className={labelStyle}>နိုင်ငံခြားသား</label>
            <select {...register("mother_nationality")} className={inputStyle} >
              <option value="တိုင်းရင်းသား">တိုင်းရင်းသား</option>
              <option value="နိုင်ငံခြားသား">နိုင်ငံခြားသား</option>
            </select>
          </div>
        </div>

        {/* Matriculation Info */}
        <h4 className="font-bold text-indigo-600 text-sm border-b pb-2 mt-6">တက္ကသိုလ်ဝင်တန်းစာမေးပွဲ အောင်မြင်သည့် အချက်အလက်</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>ခုံအမှတ်</label>
            <input {...register("matric_roll_no")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>ခုနှစ်</label>
            <input {...register("matric_year")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>စာစစ်ဌာန</label>
            <input {...register("matric_dept")} className={inputStyle} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalStep;
