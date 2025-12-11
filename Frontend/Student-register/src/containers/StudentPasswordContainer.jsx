import React, { useState } from "react";
import StudentVerifyForm from "../components/authComponents/StudentVerifyForm.jsx";
import StudentPasswordForm from "../components/authComponents/SetPasswordForm.jsx";
import { verifyStudent, setStudentPassword } from "../services/authServices";
import { useNavigate } from "react-router-dom";

export default function StudentPasswordContainer() {
  const [step, setStep] = useState("verify"); // verify -> password -> completed
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleVerify = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const result = await verifyStudent(data);
      if (result.success) {
        // Store student data or fallback to form data
        const studentData = result.student || {
          nrc: data.nrcNumber,
          enrollment_number: data.admissionNumber,
          date_of_birth: data.dateOfBirth,
          g12_exam_id: data.g12ExamId
        };
        setStudent(studentData);
        setStep("password");
        setMessage("✓ Verification successful. Please set your password.");
      } else {
        setMessage("✗ " + (result.message || "Verification failed"));
      }
    } catch (err) {
      setMessage("✗ " + (err.message || "Verification failed. Please check your details."));
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      if (!student) {
        setMessage("✗ Student data not found. Please verify again.");
        setStep("verify");
        return;
      }
      
      const payload = { 
        ...data, 
        nrc: student.nrc, 
        enrollment_number: student.enrollment_number, 
        date_of_birth: student.date_of_birth 
      };
      console.log('Setting password with payload:', payload);
      
      const result = await setStudentPassword(payload);
      if (result.success) {
        setStep("completed");
        setMessage("✓ Password set successfully. You can now login.");
      } else {
        setMessage("✗ " + (result.message || "Password setup failed"));
      }
    } catch (err) {
      setMessage("✗ " + (err.message || "Password setup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
            Loading...
          </div>
        )}
        {message && (
          <div className={`px-4 py-3 rounded mb-4 text-center font-medium ${
            message.startsWith('✓') 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {step === "verify" && <StudentVerifyForm onVerify={handleVerify} />}
        {step === "password" && <StudentPasswordForm onSetPassword={handleSetPassword} />}
        {step === "completed" && (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup Completed!</h2>
            <p className="text-gray-600">You can now login with your credentials.</p>
              <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Go to Login
        </button>
          </div>
         
        )}
      </div>
    </div>
  );
}
