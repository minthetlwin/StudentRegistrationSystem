import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  Send,
  RefreshCw,
  User,
  MapPin,
  FileText,
  ShieldCheck
} from 'lucide-react';

// Import Modular Steps
[EducationStep, PreviousExamsStep, PersonalStep, AddressStep, VerificationStep, PledgeStep].forEach(comp => {
  // This is just a placeholder for the imports above. 
  // I will write the actual imports below.
});

import EducationStep from './RegistrationSteps/EducationStep';
import PreviousExamsStep from './RegistrationSteps/PreviousExamsStep';
import PersonalStep from './RegistrationSteps/PersonalStep';
import AddressStep from './RegistrationSteps/AddressStep';
import VerificationStep from './RegistrationSteps/VerificationStep';
import PledgeStep from './RegistrationSteps/PledgeStep';

import { registerStudent } from '../../../services/studentAPI';

export default function InfoRegister({ user, role, onComplete }) {
  const [livePhoto, setLivePhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [pledgeAgreed, setPledgeAgreed] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  const methods = useForm({
    defaultValues: {
      year_of_study: '',
      academic_year: '',
      major: 'CS',
      roll_no: '',
      reg_no: '',
      yr_no: '',
      previous_exams: [{ exam_name: '', major: '', roll_no: '', year: '', result: '' }],
      // ... other fields will be registered on mount
    }
  });

  const { handleSubmit, watch, formState: { errors } } = methods;
  const yearOfStudy = watch("year_of_study");

  const onProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSubmissionStatus('submitting');
    setErrorMessage(null);
    
    try {
      const finalData = { 
        ...data, 
        profile_photo: profilePhoto, 
        live_photo: livePhoto,
        // If First Year, clear previous exams to be safe
        previous_exams: yearOfStudy === 'First Year' ? [] : data.previous_exams 
      };

      await registerStudent(finalData);
      setSubmissionStatus('success');
    } catch (err) {
      // Improved error handling
      const errorMessage = typeof err === 'string' ? err : (err?.message || "Something went wrong during registration.");
      setErrorMessage(errorMessage);
      setSubmissionStatus('idle');
    }
  };

  const steps = [
    { id: 1, title: 'ပညာရေး', icon: BookOpen },
    { id: 2, title: 'ယခင်စာမေးပွဲများ', icon: FileText },
    { id: 3, title: 'ကိုယ်ရေးရာဇဝင်', icon: User },
    { id: 4, title: 'နေရပ်လိပ်စာ', icon: MapPin },
    { id: 5, title: 'အတည်ပြုချက်', icon: CheckCircle },
    { id: 6, title: 'ကတိဝန်ခံချက်', icon: ShieldCheck },
  ];

  const renderStep = () => {
    switch (activeStep) {
      case 1: return <EducationStep />;
      case 2: return <PreviousExamsStep />;
      case 3: return <PersonalStep />;
      case 4: return <AddressStep />;
      case 5: return (
        <VerificationStep 
          profilePhoto={profilePhoto} 
          onProfilePhotoChange={onProfilePhotoChange} 
          livePhoto={livePhoto} 
          setLivePhoto={setLivePhoto} 
        />
      );
      case 6: return <PledgeStep pledgeAgreed={pledgeAgreed} setPledgeAgreed={setPledgeAgreed} />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ကျောင်းသားမှတ်ပုံတင်ခြင်း</h2>
          <p className="text-slate-500 font-medium">ကျေးဇူးပြု၍ သင့်အချက်အလက်များကို မြန်မာဘာသာဖြင့် တိကျစွာ ဖြည့်စွက်ပေးပါ</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {steps
            .filter(step => !(step.id === 2 && yearOfStudy === 'First Year'))
            .map((step, idx, filteredSteps) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeStep === step.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : activeStep > step.id 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeStep === step.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
              {idx < filteredSteps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-50 mx-4 mt-[-20px] relative">
                  <div 
                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: activeStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="glass-card rounded-[32px] p-8 md:p-12 min-h-[500px]">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 3 && yearOfStudy === 'First Year') {
                    setActiveStep(1);
                  } else {
                    setActiveStep(prev => Math.max(1, prev - 1));
                  }
                }}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  activeStep === 1 
                    ? 'invisible' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                နောက်သို့
              </button>

              {activeStep < 6 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 1 && yearOfStudy === 'First Year') {
                      setActiveStep(3);
                    } else {
                      setActiveStep(prev => prev + 1);
                    }
                  }}
                  className="btn-primary py-3.5 px-10 flex items-center space-x-2"
                >
                  <span>ရှေ့သို့</span>
                  <Send className="w-4 h-4 rotate-[-45deg]" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submissionStatus === 'submitting' || !livePhoto || !profilePhoto || !pledgeAgreed}
                  className={`btn-primary py-3.5 px-12 flex items-center space-x-3 ${
                    (submissionStatus === 'submitting' || !livePhoto || !profilePhoto || !pledgeAgreed) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submissionStatus === 'submitting' ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>ပေးပို့နေပါသည်...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>အချက်အလက်များ ပေးပို့ရန်</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Success Modal Overlay */}
        {submissionStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-12 text-center max-w-sm shadow-2xl space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ!</h3>
              <p className="text-slate-500 font-medium">သင်၏မှတ်ပုံတင်မှုကို အုပ်ချုပ်သူမှ မကြာမီ စစ်ဆေးပေးပါလိမ့်မည်။</p>
              <button 
                onClick={() => {
                  setSubmissionStatus('idle');
                  if (onComplete) onComplete();
                }}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
              >
                အတည်ပြုပါ
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </FormProvider>
  );
}
