import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FileText, Trash2, Plus } from 'lucide-react';
import { inputStyle } from './formStyles';

const PreviousExamsStep = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "previous_exams"
  });

  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>၂။ ဖြေဆိုခဲ့သည့်စာမေးပွဲများ (ယခင်နှစ်များ)</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">ဖြေဆိုခဲ့သည့်စာမေးပွဲ</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">အဓိကဘာသာ</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">ခုံအမှတ်</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">ခုနှစ်</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">အောင်/ရှုံး</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-2 py-3">
                  <input 
                    {...register(`previous_exams.${index}.exam_name`)}
                    type="text" 
                    className={inputStyle} 
                    placeholder="ဥပမာ-ပထမနှစ်"
                  />
                </td>
                <td className="px-2 py-3">
                  <input 
                    {...register(`previous_exams.${index}.major`)}
                    type="text" 
                    className={inputStyle} 
                  />
                </td>
                <td className="px-2 py-3">
                  <input 
                    {...register(`previous_exams.${index}.roll_no`)}
                    type="text" 
                    className={inputStyle}
                  />
                </td>
                <td className="px-2 py-3">
                  <input 
                    {...register(`previous_exams.${index}.year`)}
                    type="text" 
                    className={inputStyle}
                  />
                </td>
                <td className="px-2 py-3">
                  <input 
                    {...register(`previous_exams.${index}.result`)}
                    type="text" 
                    className={inputStyle}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  {fields.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        type="button"
        onClick={() => append({ exam_name: '', major: '', roll_no: '', year: '', result: '' })}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>စာတန်းအသစ်ထည့်ရန်</span>
      </button>
    </motion.div>
  );
};

export default PreviousExamsStep;
