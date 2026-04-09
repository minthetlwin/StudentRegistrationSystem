import React, { useState, useEffect } from 'react';
import { Search, Loader2, IndianRupee, CheckCircle, XCircle, Eye, HandCoins, Pencil } from 'lucide-react';
import { getPayments, updatePaymentStatus, getPaymentSettings, updatePaymentSettings } from '../../services/adminServices';
import ViewSlipModal from '../adminComponents/ViewSlipModal';
import FeeBreakdownModal from '../adminComponents/FeeBreakdownModal';

export default function PaymentList({ user, role }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [error, setError] = useState(null);

  const fetchPaymentsAndSettings = async () => {
    try {
      setLoading(true);
      const [pmtRes, settingsRes] = await Promise.all([
        getPayments(),
        getPaymentSettings()
      ]);
      setPayments(pmtRes.data || []);
      setGlobalSettings(settingsRes.data || { feeBreakdown: [] });
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsAndSettings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const remark = status === 'REJECTED' ? prompt('Enter reason for rejection:') : '';
      if (status === 'REJECTED' && remark === null) return;
      
      await updatePaymentStatus(id, { status, adminRemark: remark });
      await fetchPaymentsAndSettings();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleUpdateSettings = async (feeBreakdown) => {
    try {
      await updatePaymentSettings(feeBreakdown);
      await fetchPaymentsAndSettings();
      setIsEditingSettings(false);
    } catch (err) {
      alert(err.message || 'Failed to update global amount settings');
      throw err;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const term = searchTerm.toLowerCase();
    const isEnrMatch = payment.student?.enrollment_number?.toLowerCase().includes(term);
    const isNrcMatch = payment.student?.nrc?.toLowerCase().includes(term);
    const isNameMatch = payment.student?.full_name?.toLowerCase().includes(term);
    return isEnrMatch || isNrcMatch || isNameMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
          <HandCoins className="mr-2 text-indigo-600" />
          Student Payments
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsEditingSettings(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-xl transition-colors border border-indigo-200 shadow-sm whitespace-nowrap"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Adjust Global Fees
          </button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, Name or NRC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-slate-200 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>
      
      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden auto-scroll-x">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sr</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slip</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{payment.student?.full_name}</div>
                      <div className="text-xs text-slate-500">{payment.student?.enrollment_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">{payment.amountRequired?.toLocaleString() || globalSettings?.totalAmountRequired?.toLocaleString() || 0} MMK</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        payment.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        payment.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status !== 'UNPAID' && payment.slip_image_url ? (
                        <button
                          onClick={() => setSelectedSlip(payment.slip_image_url)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View Slip
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No slip yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {payment.status === 'PENDING' && (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(payment._id, 'APPROVED')}
                            className="inline-flex items-center px-2 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 flex-1 justify-center whitespace-nowrap"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(payment._id, 'REJECTED')}
                            className="inline-flex items-center px-2 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 flex-1 justify-center whitespace-nowrap"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                       )}
                       {payment.status !== 'PENDING' && payment.reviewedBy && (
                         <span className="text-xs text-slate-400">Reviewed by {payment.reviewedBy?.name}</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedSlip && (
        <ViewSlipModal 
          imageUrl={selectedSlip} 
          onClose={() => setSelectedSlip(null)} 
        />
      )}

      <FeeBreakdownModal
        isOpen={isEditingSettings}
        onClose={() => setIsEditingSettings(false)}
        initialBreakdown={globalSettings?.feeBreakdown}
        onSave={handleUpdateSettings}
      />
    </div>
  );
}
