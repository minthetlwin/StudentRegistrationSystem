import React, { useState, useEffect } from "react";
import PaymentForm from "../components/studentComponents/PaymentForm";
import { getPaymentStatus, submitPayment } from "../services/studentAPI";

export default function PaymentContainer() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [amountRequired, setAmountRequired] = useState(500000);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getPaymentStatus();
      if (res.exists) {
        setPaymentData(res.data);
      } else {
        setAmountRequired(res.amountRequired || 500000);
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
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
