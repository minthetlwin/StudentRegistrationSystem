import React, { useState } from "react";
import { Upload, CheckCircle2, Clock, XCircle, CreditCard } from "lucide-react";

export default function PaymentForm({ paymentData, amountRequired, onSubmit, loading }) {
  const [slipImage, setSlipImage] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result);
        setError("");
      };
      reader.onerror = () => {
        setError("Failed to process image.");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process image.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slipImage) {
      setError("Slip image is required.");
      return;
    }
    onSubmit({ slip_image: slipImage });
  };

  if (paymentData) {
    const isApproved = paymentData.status === "APPROVED";
    const isRejected = paymentData.status === "REJECTED";
    const isPending = paymentData.status === "PENDING";

    return (
      <div className="glass-card shadow-lg w-full max-w-lg mx-auto p-8 rounded-3xl space-y-6">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isApproved ? 'bg-emerald-100' : isRejected ? 'bg-rose-100' : 'bg-amber-100'
          }`}>
            {isApproved && <CheckCircle2 className="w-10 h-10 text-emerald-600" />}
            {isRejected && <XCircle className="w-10 h-10 text-rose-600" />}
            {isPending && <Clock className="w-10 h-10 text-amber-600" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Status</h2>
          <p className="text-slate-500 font-medium">Status: {paymentData.status}</p>
        </div>

        {paymentData.adminRemark && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-1">Admin Remark:</h4>
            <p className="text-slate-600 text-sm">{paymentData.adminRemark}</p>
          </div>
        )}

        {isRejected && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-semibold text-slate-800">Re-submit Payment Slip</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Screenshot</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50 relative">
                {slipImage ? (
                  <div className="relative group">
                    <img src={slipImage} alt="Payment Slip" className="max-h-48 object-contain rounded-lg" />
                    <button type="button" onClick={() => setSlipImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full text-xs">
                      X
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 mt-2">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 px-2 py-1">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {error && <p className="text-sm text-rose-600">{error}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl transition"
            >
              {loading ? 'Submitting...' : 'Submit Slip'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Not submitted yet
  return (
    <div className="glass-card shadow-lg w-full max-w-lg mx-auto p-8 rounded-3xl space-y-6">
      <div className="text-center mb-6 mt-2">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Make Payment</h2>
        <p className="text-slate-500">Please review your required fees.</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
        <h3 className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-sm">Required Amount</h3>
        <p className="text-4xl font-bold">{amountRequired.toLocaleString()} MMK</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="block text-sm justify-between font-medium text-slate-700 mb-2">Upload Payment Slip Screenshot</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50 relative">
            {slipImage ? (
              <div className="relative group">
                <img src={slipImage} alt="Payment Slip" className="max-h-48 object-contain rounded-lg shadow" />
                <button type="button" onClick={() => setSlipImage(null)} className="absolute -top-3 -right-3 bg-white text-rose-500 p-1.5 rounded-full text-xs shadow-md border hover:bg-rose-50">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm justify-center text-slate-600 mt-2">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 border px-3 py-1.5 shadow-sm">
                    <span>Select an image</span>
                    <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-xs text-slate-400 mt-2">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>
        
        {error && <p className="text-sm font-medium text-rose-600 animate-pulse">{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading || !slipImage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md shadow-indigo-100 hover:shadow-lg"
        >
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
}
