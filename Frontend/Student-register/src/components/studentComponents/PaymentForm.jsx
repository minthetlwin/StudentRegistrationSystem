import React, { useState, useEffect } from "react";
import { Upload, CheckCircle2, Clock, XCircle, CreditCard, Download } from "lucide-react";

export default function PaymentForm({ paymentData, amountRequired, feeBreakdown = [], onSubmit, loading }) {
  const [slipImage, setSlipImage] = useState(null);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString());
  }, []);

  const handleDownload = () => {
    const studentName = paymentData?.student?.full_name || 'N/A';
    const studentId = paymentData?.student?.enrollment_number || paymentData?._id?.slice(-6).toUpperCase() || 'N/A';
    const date = new Date().toLocaleString();

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    const breakdownLines = displayBreakdown.length;
    canvas.height = 350 + (breakdownLines * 30);
    
    const ctx = canvas.getContext('2d');

    // Fill white background
    ctx.fillStyle = '#fdfbf7'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    
    let y = 50;
    ctx.fillText('OFFICIAL RECEIPT', 300, y);
    
    // Divider
    ctx.beginPath();
    ctx.moveTo(200, y + 10);
    ctx.lineTo(400, y + 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    y += 60;
    
    ctx.fillText(`Date:`, 50, y); 
    ctx.fillText(date, 180, y); y += 30;
    ctx.fillText(`Student Name:`, 50, y); 
    ctx.fillText(studentName, 180, y); y += 30;
    ctx.fillText(`Student ID:`, 50, y); 
    ctx.fillText(studentId, 180, y); y += 50;
    
    // Dotted line header
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Description', 50, y);
    ctx.textAlign = 'right';
    ctx.fillText('Amount', 550, y);
    ctx.textAlign = 'left';
    y += 20;

    const drawDottedLine = (yPos) => {
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.lineCap = "round";
        ctx.moveTo(50, yPos);
        ctx.lineTo(550, yPos);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#94a3b8'; // slate-400
        ctx.stroke();
        ctx.setLineDash([]);
    };
    
    drawDottedLine(y); 
    y += 30;

    ctx.font = '16px sans-serif';
    displayBreakdown.forEach(fee => {
        ctx.fillText(fee.description, 50, y);
        const amountStr = `ကျပ် ${fee.amount?.toLocaleString()}/-`;
        ctx.textAlign = 'right';
        ctx.fillText(amountStr, 550, y);
        ctx.textAlign = 'left';
        
        y += 30;
    });
    
    drawDottedLine(y); 
    y += 40;
    
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('စုစုပေါင်း (Total)', 50, y);
    ctx.textAlign = 'right';
    ctx.fillText(`ကျပ် ${displayAmount?.toLocaleString()}/-`, 550, y);
    
    // Download logic
    const link = document.createElement('a');
    link.download = `Receipt_${studentId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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
      reader.onerror = () => setError("Failed to process image.");
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

  const isApproved = paymentData?.status === "APPROVED";
  const isRejected = paymentData?.status === "REJECTED";
  const isPending = paymentData?.status === "PENDING";
  const isUnpaid = !paymentData || paymentData?.status === "UNPAID";

  const displayAmount = paymentData ? paymentData.amountRequired : amountRequired;
  const displayBreakdown = paymentData?.feeBreakdown?.length > 0 ? paymentData.feeBreakdown : feeBreakdown;

  return (
    <div className="glass-card shadow-lg w-full max-w-lg mx-auto p-8 rounded-3xl space-y-6">
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
          isApproved ? 'bg-emerald-100' : isRejected ? 'bg-rose-100' : isPending ? 'bg-amber-100' : 'bg-indigo-100'
        }`}>
          {isApproved && <CheckCircle2 className="w-10 h-10 text-emerald-600" />}
          {isRejected && <XCircle className="w-10 h-10 text-rose-600" />}
          {isPending && <Clock className="w-10 h-10 text-amber-600" />}
          {isUnpaid && <CreditCard className="w-10 h-10 text-indigo-600" />}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isUnpaid ? 'Make Payment' : 'Payment Status'}
        </h2>
        {paymentData && !isUnpaid && <p className="text-slate-500 font-medium">Status: {paymentData.status}</p>}
        {isUnpaid && <p className="text-slate-500 font-medium">Please review your required fees.</p>}
      </div>

      {/* Admin Remark */}
      {paymentData?.adminRemark && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-1">Admin Remark:</h4>
          <p className="text-slate-600 text-sm">{paymentData.adminRemark}</p>
        </div>
      )}

      {/* Traditional Paper Receipt Fee Breakdown */}
      {displayBreakdown && displayBreakdown.length > 0 ? (
        <div className="bg-[#fdfbf7] border border-slate-300 rounded-sm mb-6 shadow-md relative overflow-hidden font-sans">
          {/* Subtle texture / top edge */}
          <div className="h-2 bg-indigo-600 w-full absolute top-0 left-0"></div>
          
          <div className="p-8 pt-10">
            <h3 className="font-bold text-slate-800 text-center text-lg mb-8 tracking-widest uppercase border-b-2 border-slate-800 pb-2 inline-block mx-auto flex justify-center">
              Official Receipt
            </h3>
            
            <div className="space-y-4">
              {displayBreakdown.map((fee, index) => (
                <div key={index} className="flex items-end justify-between font-medium text-slate-800">
                  <span className="whitespace-nowrap">{fee.description}</span>
                  {/* Dot Leader */}
                  <span className="flex-grow border-b-2 border-dotted border-slate-400 mx-2 relative top-[-4px]"></span>
                  <span className="whitespace-nowrap font-bold">ကျပ် {fee.amount?.toLocaleString()}/-</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-800">
              <div className="flex items-end justify-between font-bold text-lg text-slate-900">
                <span className="whitespace-nowrap">စုစုပေါင်း (Total Amount)</span>
                <span className="flex-grow border-b-2 border-dotted border-transparent mx-2 relative top-[-4px]"></span>
                <span className="whitespace-nowrap">ကျပ် {displayAmount?.toLocaleString()}/-</span>
              </div>
            </div>

            {/* <div className="mt-8 flex justify-between text-xs text-slate-500 italic">
              <span>Downloaded: {currentDate}</span>
              <span>Chalan No: {paymentData?._id?.slice(-6).toUpperCase() || 'N/A'}</span>
            </div> */}
            
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
          <h3 className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-sm">Required Amount</h3>
          <p className="text-4xl font-bold">{displayAmount?.toLocaleString()} MMK</p>
          {isUnpaid && <p className="text-sm mt-2 text-indigo-200">Waiting for fee breakdown</p>}
        </div>
      )}

      {/* Download Button */}
      {displayBreakdown && displayBreakdown.length > 0 && (
        <button 
          type="button" 
          onClick={handleDownload}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </button>
      )}

      {/* Upload Form Component */}
      {(isUnpaid || isRejected) && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-semibold text-slate-800">
            {isRejected ? 'Re-submit Payment Slip' : 'Upload Payment Slip Screenshot'}
          </h3>
          <div>
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
      )}
    </div>
  );
}
