import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  GraduationCap, 
  Users, 
  Home, 
  ShieldCheck, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  MapPin,
  Briefcase,
  Smartphone,
  Calendar,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

export default function StudentRegistrationDetailModal({ isOpen, onClose, registration, onUpdateStatus }) {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !registration) return null;

  const handleAction = async (status) => {
    if (status === 'REJECTED' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (status === 'REJECTED' && !remark) {
      alert('Please provide a remark explaining the rejection.');
      return;
    }
    
    setIsSubmitting(true);
    await onUpdateStatus(registration._id, status, remark);
    setIsSubmitting(false);
    if (status === 'REJECTED') setShowRejectInput(false);
  };

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 leading-none">{title}</h3>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );

  const InfoCard = ({ label, value, icon: Icon, className = "" }) => (
    <div className={`p-5 bg-white border border-slate-200 rounded-[1.5rem] flex items-start gap-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all ${className}`}>
      {Icon && <div className="mt-1 p-2 bg-slate-50 rounded-xl">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>}
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base font-bold text-slate-900 break-words leading-tight">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative bg-slate-50 w-full max-w-6xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20"
      >
        {/* Header - Sticky */}
        <div className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between z-20 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-slate-900 truncate tracking-tight">{registration.student?.full_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-3 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {registration.student?.enrollment_number}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  {registration.year_of_study} / Faculty of<span className="px-3 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {registration.major}
                </span>
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all active:scale-95 border border-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
          
          {/* 1. Identity Verification Dashboard */}
          <section>
            <SectionTitle icon={Camera} title="Identity Verification" subtitle="Visual ID Comparison" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Photo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Profile Photo (Submitted)</h4>
                  <a href={registration.profile_photo_url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View HD</a>
                </div>
                <div className="aspect-[4/3] bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 border border-white">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden group">
                    <img 
                      src={registration.profile_photo_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                </div>
              </div>
              {/* Live Photo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Live Capture (Webcam)</h4>
                  <a href={registration.live_photo_url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View HD</a>
                </div>
                <div className="aspect-[4/3] bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 border border-white">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden group">
                    <img 
                      src={registration.live_photo_url} 
                      alt="Live" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
              <Info className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-bold text-amber-800 leading-relaxed italic">
                ကျောင်းသားတင်ထားသော Profile Photo နှင့် Live Capture ထဲရှိ မျက်နှာတူညီမှုရှိကြောင်း စစ်ဆေးရန်သာဖြစ်ပါသည်။
              </p>
            </div>
          </section>

          {/* 2. Personal Information */}
          <section>
            <SectionTitle icon={User} title="Personal Details" subtitle="Official Documentation Data" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard label="Full Name (Myanmar)" value={registration.name_mm} icon={User} />
              <InfoCard label="Full Name (English)" value={registration.name_en} icon={User} />
              <InfoCard label="NRC Number" value={registration.nrc} icon={ShieldCheck} />
              <InfoCard label="Date of Birth" value={new Date(registration.dob).toLocaleDateString()} icon={Calendar} />
              <InfoCard label="Birth place" value={registration.birth_place} icon={MapPin} />
              <InfoCard label="Religion" value={registration.religion} icon={MapPin} />
              <InfoCard label="Nationality" value={registration.nationality} icon={MapPin} />
               
              <InfoCard label="Contact Phone" value={registration.phone} icon={Smartphone} />
              <InfoCard label="Permanent Address" value={registration.address} icon={Home} className="md:col-span-2" />
            </div>
          </section>

          {/* 3. Academic Background */}
          <section>
            <SectionTitle icon={GraduationCap} title="Education History" subtitle="Verified Academic Records" />
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard label="ခုမှတ်" value={registration.matric_roll_no} icon={GraduationCap} />
                <InfoCard label="ခုနှစ်" value={registration.matric_year} icon={FileText} />
                <InfoCard label="စာစစ်ဥှညန" value={registration.matric_dept} icon={Home} />
              </div>
              
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Previous University Exams
                </h4>
                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic Year</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Major</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Roll Number / ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">year</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pass / Fail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registration.previous_exams?.map((exam, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-black text-slate-900">{exam.exam_name}</td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">{exam.major}</td>
                          <td className="px-6 py-4 text-sm font-black text-indigo-600 font-mono italic tracking-tighter">{exam.roll_no}</td>
                          <td className="px-6 py-4 text-sm font-black text-indigo-600 font-mono italic tracking-tighter">{exam.year}</td>
                          <td className="px-6 py-4 text-sm font-black text-indigo-600 font-mono italic tracking-tighter">{exam.result}</td>
                        </tr>
                      ))}
                      {(!registration.previous_exams || registration.previous_exams.length === 0) && (
                        <tr><td colSpan="2" className="px-6 py-8 text-center text-sm text-slate-300 font-bold italic">First Year Entry - No previous exams found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Family & Guardian Details */}
          <section>
            <SectionTitle icon={Users} title="Family Information" subtitle="Parental Contact & Verification" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Father */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Father's Data
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Myanmar Name</span>
                    <span className="text-sm font-black text-slate-900">{registration.father_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">English Name</span>
                    <span className="text-sm font-black text-slate-900">{registration.father_name_en}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_nrc}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_race}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_religion}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_birth_place}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_state_division}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.father_nationality}</span>
                  </div>
                </div>
              </div>
              {/* Mother */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Mother's Data
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Myanmar Name</span>
                    <span className="text-sm font-black text-slate-900">{registration.mother_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">English Name</span>
                    <span className="text-sm font-black text-slate-900">{registration.mother_name_en}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_nrc}</span>
                  </div>
                     <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_race}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_religion}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_birth_place}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_state_division}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">NRC Number</span>
                    <span className="text-sm font-black text-indigo-600">{registration.mother_nationality}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Guarantor Information */}
          <section className="mb-10">
            <SectionTitle icon={ShieldCheck} title="Guarantor Details" subtitle="Financial & Conduct Responsibility" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Guarantor Name" value={registration.guarantor_name} icon={User} />
              <InfoCard label="Relationship" value={registration.guarantor_relation} icon={Users} />
              <InfoCard label="NRC Number" value={registration.guarantor_nrc} icon={ShieldCheck} />
              <InfoCard label="Occupation" value={registration.guarantor_occupation} icon={Briefcase} />
              <InfoCard label="Address" value={registration.guarantor_address} icon={Home} className="md:col-span-2" />
              <InfoCard label="Contact Phone" value={registration.guarantor_phone} icon={Smartphone} />
            </div>
          </section>
        </div>

        {/* Footer - Actions (Sticky) */}
        <div className="px-8 py-8 bg-white border-t border-slate-100 z-20 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          {registration.status === 'PENDING' ? (
            <div className="space-y-6">
              <AnimatePresence>
                {showRejectInput && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    className="overflow-hidden"
                  >
                    <div className="p-1 px-2">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> Reason for Rejection (Required)
                      </p>
                      <textarea
                        autoFocus
                        placeholder="Please explain why this application is being rejected..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="w-full px-6 py-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm font-bold text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300 transition-all min-h-[100px] resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4">
                {showRejectInput ? (
                  <>
                    <button
                      onClick={() => { setShowRejectInput(false); setRemark(''); }}
                      className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black shadow-sm hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSubmitting || !remark}
                      onClick={() => handleAction('REJECTED')}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Confirm & Send Rejection
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleAction('REJECTED')}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-rose-100 text-rose-600 rounded-2xl font-black shadow-lg shadow-rose-100/50 hover:bg-rose-50 transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleAction('APPROVED')}
                      className="flex-[2] flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Registrations
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${registration.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {registration.status === 'APPROVED' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-0.5">Verification Complete</h4>
                  <p className="text-xs font-black text-slate-400 flex items-center gap-2">
                    Current Status: <span className={registration.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}>{registration.status}</span>
                  </p>
                </div>
              </div>
              {registration.adminRemark && (
                <div className="flex-1 px-8 md:border-l border-slate-200 max-w-xl">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Admin Feedback</p>
                   <p className="text-sm font-bold text-slate-600 italic leading-relaxed">"{registration.adminRemark}"</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200/50 hover:bg-black transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
