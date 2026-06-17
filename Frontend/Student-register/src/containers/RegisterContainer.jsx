import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StudentTypeSelector from "../components/StudentTypeSelector";
import StudentVerifyForm from "../components/authComponents/StudentVerifyForm";
import SetPasswordForm from "../components/authComponents/SetPasswordForm";
import { verifyStudent, setStudentPassword } from "../services/authServices";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function RegisterContainer() {
  const [step, setStep] = useState(1); // 1: Type, 2: Verify, 3: Password, 4: Success
  const [studentType, setStudentType] = useState(null);
  const [verifiedData, setVerifiedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setStudentType(type);
    if (type === "old") {
      navigate("/login");
    } else {
      setStep(2);
    }
  };

  const handleVerify = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyStudent(data);
      if (res.success) {
        setVerifiedData(res.student);
        setStep(3);
      } else {
        setError(res.message || "Verification failed. Please check your data.");
      }
    } catch (err) {
      setError(err.message || "Student not found in records. Please check your IDs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        nrc: verifiedData.nrc,
        date_of_birth: verifiedData.date_of_birth,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      };
      
      const res = await setStudentPassword(payload);
      if (res.success) {
        setStep(4);
      } else {
        setError(res.message || "Failed to set password.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Student Type' },
    { id: 2, title: 'Verification' },
    { id: 3, title: 'Security' },
    { id: 4, title: 'Success' }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Identity Setup</h2>
            <p className="text-slate-500 font-medium">Verify your identity and secure your university account</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    step === s.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : step > s.id 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
                >
                  <span className="text-sm font-bold">{s.id}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-50 mx-4 mt-[-20px] relative">
                  <div 
                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: step > s.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Area */}
        <div className="max-w-2xl mx-auto">
            {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 shadow-sm"
            >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
            </motion.div>
            )}

            <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                >
                <StudentTypeSelector onSelect={handleTypeSelect} />
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 rounded-[40px]"
                >
                <div className="mb-8 flex items-center gap-3">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <h3 className="text-xl font-bold text-slate-900">Verify Identity</h3>
                </div>
                <StudentVerifyForm onVerify={handleVerify} loading={loading} />
                </motion.div>
            )}

            {step === 3 && (
                <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 rounded-[40px]"
                >
                <div className="mb-8 flex items-center gap-3">
                    <button onClick={() => setStep(2)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">Welcome, {verifiedData?.full_name}</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-tight mt-1">Now, let's secure your university portal account</p>
                    </div>
                </div>
                <SetPasswordForm onSetPassword={handleSetPassword} loading={loading} />
                </motion.div>
            )}

            {step === 4 && (
                <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 rounded-[40px] text-center space-y-6 mx-auto"
                >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Success!</h3>
                <p className="text-slate-500 font-medium">Your identity has been verified and your account is ready. You can now login to complete your official registration.</p>
                <button 
                    onClick={() => navigate("/login")}
                    className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-indigo-100"
                >
                    Return to Login
                </button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
