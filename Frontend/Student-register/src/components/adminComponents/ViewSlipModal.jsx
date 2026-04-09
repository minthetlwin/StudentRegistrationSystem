import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function ViewSlipModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Payment Slip</h3>
          <div className="flex items-center gap-2">
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Open full size"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 bg-slate-50 flex justify-center items-center min-h-[300px]">
          <img 
            src={imageUrl} 
            alt="Payment Slip" 
            className="max-h-[70vh] object-contain rounded-lg shadow-sm border border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}
