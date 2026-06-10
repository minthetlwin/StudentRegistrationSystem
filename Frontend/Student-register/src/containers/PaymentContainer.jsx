import React, { useState, useEffect } from "react";
import PaymentForm from "../components/studentComponents/PaymentForm";
import { getPaymentStatus, submitPayment } from "../services/studentAPI";
import { SkeletonCard } from "../components/SkeletonLoaders";

export default function PaymentContainer() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [amountRequired, setAmountRequired] = useState(0);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getPaymentStatus();
      
      // 🔥 THE COMPLETE CONTAINER SYNC FIX
      if (res.success && res.data) {
        setPaymentData(res.data);
        setAmountRequired(res.data.amountRequired || 0);
        setFeeBreakdown(res.data.feeBreakdown || []);
      } else {
        // Fallback catch-all if backend shape shifts
        setPaymentData(null);
        setAmountRequired(res.amountRequired || 0);
        setFeeBreakdown(res.feeBreakdown || []);
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

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await submitPayment(data);
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

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
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