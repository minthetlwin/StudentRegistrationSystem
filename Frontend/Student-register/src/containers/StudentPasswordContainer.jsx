import React, { useState, useEffect } from "react";
import PaymentForm from "../components/studentComponents/PaymentForm";
import { getPaymentStatus, submitPayment } from "../services/studentAPI";
import { SkeletonCard } from "../components/SkeletonLoaders";
import { Lock } from "lucide-react"; // Import lock icon for closed portals

export default function PaymentContainer() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [amountRequired, setAmountRequired] = useState(0);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [error, setError] = useState("");
  
  // 🔥 NEW STATES FOR SEMESTER CONTROL
  const [isLocked, setIsLocked] = useState(false);
  const [semesterInfo, setSemesterInfo] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPaymentStatus();
      
      // 1. 🔥 Check if admin closed the payment window for this semester
      if (res.isLocked) {
        setIsLocked(true);
        setSemesterInfo(res.semester); // e.g., { id: "...", name: "Semester 1" }
        return;
      }

      setIsLocked(false);

      // 2. 🔥 Parse data from the semester-scoped response shape
      if (res.success && res.data) {
        setPaymentData(res.data);
        setAmountRequired(res.data.amountRequired || 0);
        setFeeBreakdown(res.data.feeBreakdown || []);
        // Save semester details from inside the payment record or fallback root
        setSemesterInfo(res.data.semester || res.semester || null);
      } else {
        setPaymentData(null);
        setAmountRequired(res.amountRequired || 0);
        setFeeBreakdown(res.feeBreakdown || []);
        setSemesterInfo(res.semester || null);
      }
    } catch (err) {
      setError(err?.message || "Failed to load payment information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // 3. 🔥 Attach the active semester ID before sending to backend
      const payload = {
        ...formData,
        semesterId: semesterInfo?._id || semesterInfo?.id || semesterInfo
      };

      await submitPayment(payload);
      await loadData();
    } catch (err) {
      setError(err?.message || "Failed to submit payment slip.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <SkeletonCard />
      </div>
    );
  }

  // 4. 🔥 Lock Screen UI if Admin turned off payment window
  if (isLocked) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto shadow-lg">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Lock className="w-10 h-10 text-amber-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Payment Window Closed</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          The payment portal for <span className="font-semibold text-slate-800">{semesterInfo?.name || "the current semester"}</span> is currently closed by administration.
        </p>
        <p className="text-xs text-slate-400">Please check back later or contact support if you think this is a mistake.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      
      {/* Optional: Add a small banner reminding which semester they are paying for */}
      {semesterInfo?.name && (
        <div className="max-w-lg mx-auto mb-4 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Active Billing Cycle: {semesterInfo.name} ({semesterInfo.academicYear || "Current Year"})
        </div>
      )}

      <PaymentForm
        paymentData={paymentData}
        amountRequired={amountRequired}
        feeBreakdown={feeBreakdown}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}