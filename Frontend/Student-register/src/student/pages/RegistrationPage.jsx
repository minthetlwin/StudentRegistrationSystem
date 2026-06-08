import React from "react";
import StudentVerifyForm from '../../auth/components/StudentVerifyForm';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <StudentVerifyForm />
    </div>
  );
}
