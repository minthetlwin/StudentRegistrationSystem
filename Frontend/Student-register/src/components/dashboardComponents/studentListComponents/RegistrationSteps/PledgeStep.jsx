import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, ShieldCheck, CheckCircle } from 'lucide-react';
import { inputStyle, labelStyle } from './formStyles';

const PledgeStep = ({ pledgeAgreed, setPledgeAgreed }) => {
  const { register } = useFormContext();

  const pledges = [
    "အထက်ဖော်ပြပါ အချက်အားလုံးမှန်ကန်ပါသည်။",
    "ဤတက္ကသိုလ်သို့ ဆက်လက်ပညာသင်ကြားခွင့်တောင်းသည်ကို ဖခင် (သို့မဟုတ်) အုပ်ထိန်းသူက သဘောတူပြီး ဖြစ်ပါသည်။",
    "ကျောင်းလမ်းညွှန်ချက်များနှင့် ဆောင်ရွက်ချက်များကို ဖခင် (သို့မဟုတ်) အုပ်ထိန်းသူက သဘောတူပြီး ဖြစ်ပါသည်။",
    "တက္ကသိုလ်/ကောလိပ်မှ ချမှတ်သော နည်းလမ်းနည်းများနှင့်အညီ လိုက်နာကျင့်သုံးပါမည်။",
    "ကျွန်တော်/ကျွန်မသည် မည်သည့်နိုင်ငံရေးပါတီတို့တွင် မပါဝင်ဘဲ မည်သည့်နိုင်ငံရေးလှုပ်ရှားများတွင်မှ ပါဝင်မည် မဟုတ်ကြောင်း ဝန်ခံကတိပြုပါသည်။",
  ];

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Guarantor Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>ကျောင်းနေရေးနှင့် ထောက်ခံမည့်ပုဂ္ဂိုလ် (အုပ်ထိန်းသူ)</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="col-span-2">
          <label className={labelStyle}>ပညာသင်ချောင်ပ့ကြေး ပေးနှင် ကူညီမည့်ပုဂ္ဂိုလ် (ရှိပါက)</label>
            <select {...register("sponser_name")} className={inputStyle} >
                        <option value="ရှိ">ရှိ</option>
                        <option value="မရှိ">မရှိ</option>
            </select>
        </div>
        <div>
          <label className={labelStyle}>(က) အမည်</label>
          <input {...register("guarantor_name")} className={inputStyle} placeholder="အုပ်ထိန်းသူ အမည်" />
        </div>
        <div>
          <label className={labelStyle}>(ဂ) အလုပ်အကိုင်</label>
          <input {...register("guarantor_occupation")} className={inputStyle} placeholder="လုပ်ငန်းအမျိုးအစား" />
        </div>
        <div className="col-span-2">
          <label className={labelStyle}>(ခ) နေရပ်လိပ်စာ</label>
          <textarea {...register("guarantor_address")} className={`${inputStyle} h-20 resize-none`} placeholder="အိမ်အမှတ်၊ လမ်း၊ ရပ်ကွက်၊ မြို့နယ်..." />
        </div>
        <div>
          <label className={labelStyle}>(ဃ) ဆက်သွယ်ရန် ဖုန်းနံပါတ်</label>
          <input {...register("guarantor_phone")} className={inputStyle} placeholder="၀၉-xxxxxxxxx" />
        </div>
        <div>
          <label className={labelStyle}>မှတ်ပုံတင်အမှတ်</label>
          <input {...register("guarantor_nrc")} className={inputStyle} placeholder="၉/မရတ(နိုင်)xxxxxx" />
        </div>
       
      </div>

      {/* Pledge Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>ကတိပိုင်ဝန်ခံချက်</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        {pledges.map((pledge, idx) => (
          <div key={idx} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[11px] font-extrabold text-indigo-600">{idx + 1}</span>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed flex-1">{pledge}</p>
          </div>
        ))}
      </div>

      {/* Agreement Checkbox */}
      <label className="flex items-start space-x-4 cursor-pointer group">
        <div
          onClick={() => setPledgeAgreed(prev => !prev)}
          className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            pledgeAgreed
              ? 'bg-indigo-600 border-indigo-600'
              : 'bg-white border-slate-300 group-hover:border-indigo-400'
          }`}
        >
          {pledgeAgreed && <CheckCircle className="w-4 h-4 text-white" />}
        </div>
        <span className="text-sm text-slate-700 font-semibold leading-relaxed">
          အထက်ဖော်ပြပါ ကတိဝန်ခံချက်များ အားလုံးကို ကျွန်တော်/ကျွန်မ သဘောတူလက်ခံပြီး ဖြစ်ပါသည်။
        </span>
      </label>
    </motion.div>
  );
};

export default PledgeStep;
