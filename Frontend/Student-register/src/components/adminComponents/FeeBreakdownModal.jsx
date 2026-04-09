import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const defaultFees = [
  { description: 'ကျောင်းဝင်ကြေး', amount: '' },
  { description: 'မှတ်ပုံတင်ကြေး', amount: '' },
  { description: 'အလွတ်မှတ်ပုံတင်ကြေး', amount: '' },
  { description: 'ကျောင်းလခ (၁၀လ)', amount: '' },
  { description: 'နောက်ကျကြေး', amount: '' },
  { description: 'မှတ်ပုံတင်ကတ်ပြား', amount: '' },
  { description: 'တ-ပ-မ-ကြေး', amount: '' },
  { description: 'စာကြည့်တိုက်ကြေး', amount: '' },
  { description: 'စာမေးပွဲဝင်ကြေး', amount: '' },
  { description: 'အထွေထွေ', amount: '' },
];

export default function FeeBreakdownModal({ isOpen, onClose, initialBreakdown, onSave }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialBreakdown && initialBreakdown.length > 0) {
        setFees(initialBreakdown.map(f => ({ ...f, amount: f.amount || '' })));
      } else {
        setFees(defaultFees.map(f => ({ ...f })));
      }
    }
  }, [isOpen, initialBreakdown]);

  if (!isOpen) return null;

  const handleAmountChange = (index, value) => {
    const updatedFees = [...fees];
    updatedFees[index].amount = value;
    setFees(updatedFees);
  };

  const handleDescriptionChange = (index, value) => {
    const updatedFees = [...fees];
    updatedFees[index].description = value;
    setFees(updatedFees);
  };

  const handleAddFee = () => {
    setFees([...fees, { description: '', amount: '' }]);
  };

  const handleRemoveFee = (index) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    setFees(updatedFees);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Clean up empty lines and parse numbers
      const cleanedBreakdown = fees
        .map(f => ({ ...f, description: f.description.trim(), amount: Number(f.amount) || 0 }))
        .filter(f => f.description !== '' || f.amount > 0);
        
      await onSave(cleanedBreakdown);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save fee breakdown');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = fees.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Edit Fee Breakdown</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Description</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mr-10">Amount (MMK)</span>
          </div>
          
          <div className="space-y-3">
            {fees.map((fee, index) => (
              <div key={index} className="flex gap-3 items-center group">
                <input
                  type="text"
                  value={fee.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Fee Description"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <input
                  type="number"
                  value={fee.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  placeholder="0"
                  className="w-32 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFee(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-50 hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={handleAddFee}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Fee Line
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col items-end">
            <span className="text-sm text-slate-500 mb-1">Total Calculated Amount</span>
            <span className="text-3xl font-bold text-slate-900">{totalAmount.toLocaleString()} MMK</span>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition-colors flex items-center disabled:opacity-50"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Breakdown
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
