import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, ArrowRight } from "lucide-react";

export default function StudentTypeSelector({ onSelect }) {
  const [selected, setSelected] = useState("");

  const handleSelect = (type) => {
    setSelected(type);
    onSelect(type); 
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-[#f8fafc]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ဖောင်တင်ရန် ရွေးချယ်ပါ</h1>
          <p className="text-slate-500 max-w-sm mx-auto">ကျောင်းသားအမျိုးအစားကို ရွေးချယ်၍ ဆက်လက်လုပ်ဆောင်ပါ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ y: -8 }}
            onClick={() => handleSelect("new")}
            className={`group relative p-10 rounded-3xl border-2 transition-all duration-300 text-left h-full flex flex-col ${
              selected === "new" 
                ? "border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100" 
                : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-lg"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
              selected === "new" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
            }`}>
              <UserPlus className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">ကျောင်းသားသစ်</h3>
            <p className="text-slate-500 text-sm mb-8 flex-grow">New Student Registration</p>
            <div className="flex items-center text-indigo-600 font-bold text-sm">
              ရွေးချယ်မည် <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -8 }}
            onClick={() => handleSelect("old")}
            className={`group relative p-10 rounded-3xl border-2 transition-all duration-300 text-left h-full flex flex-col ${
              selected === "old" 
                ? "border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100" 
                : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-lg"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
              selected === "old" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
            }`}>
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">ကျောင်းသားဟောင်း</h3>
            <p className="text-slate-500 text-sm mb-8 flex-grow">Existing Student Registration</p>
            <div className="flex items-center text-indigo-600 font-bold text-sm">
              ရွေးချယ်မည် <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

