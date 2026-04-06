import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Upload, 
  Camera, 
  RefreshCw, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { labelStyle } from './formStyles';

const VerificationStep = ({ 
  profilePhoto, 
  onProfilePhotoChange, 
  livePhoto, 
  setLivePhoto 
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageSrc = canvas.toDataURL('image/jpeg');
    setLivePhoto(imageSrc);
    stopCamera();
  }, [setLivePhoto, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <motion.div 
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          <span>ဓာတ်ပုံနှင့် အတည်ပြုချက်</span>
        </h3>
        <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <label className={labelStyle}>ပတ်စပို့ဓာတ်ပုံ (ID Photo)</label>
          <div className="relative group flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={onProfilePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {profilePhoto ? (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-600">ပုံတင်ရန် နှိပ်ပါ</p>
                <p className="text-xs text-slate-400">PNG, JPG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* Live Camera Capture */}
        <div className="space-y-4">
          <label className={labelStyle}>တိုက်ရိုက်ဓာတ်ပုံ (Live Capture)</label>
          <div className="relative flex flex-col items-center justify-center p-2 border-2 border-slate-200 rounded-3xl bg-slate-50 min-h-[300px]">
            {livePhoto ? (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <img src={livePhoto} alt="Live" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setLivePhoto(null); startCamera(); }}
                  className="absolute bottom-4 right-4 p-3 bg-white border border-slate-100 rounded-full shadow-lg hover:bg-indigo-50 transition-all text-indigo-600"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            ) : isCameraOpen ? (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={capture}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 p-5 bg-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-600 group-hover:bg-indigo-50 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-indigo-600" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow hover:bg-red-50 text-red-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-600">ဂုဏ်သိက္ခာအားအတည်ပြုရန်<br/>တိုက်ရိုက်ဓာတ်ပုံရိုက်ပါ</p>
                <button 
                  type="button"
                  onClick={startCamera}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  ကင်မရာဖွင့်ရန်
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4">
        <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          တင်ပြထားသော အချက်အလက်များ အားလုံးသည် မှန်ကန်ကြောင်း အတည်ပြုပါသည်။ မှားယွင်းမှု တစ်စုံတစ်ရာ ရှိပါက တာဝန်ယူပါမည်။
        </p>
      </div>
    </motion.div>
  );
};

export default VerificationStep;
