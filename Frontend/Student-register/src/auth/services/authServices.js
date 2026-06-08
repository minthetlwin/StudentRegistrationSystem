import { api } from "../../utils/api";

// Student Authentication
export const verifyStudent = async (data) => {
  try {
    const payload = {
      enrollment_number: data.admissionNumber,
      nrc: data.nrcNumber,
      date_of_birth: data.dateOfBirth,
      g12_exam_id: data.g12ExamId || undefined
    };
    return await api.post('/api/auth/verify-admitted', payload);
  } catch (error) {
    console.error('API Error:', error.data || error.message);
    throw error.data || { message: "Verification failed" };
  }
};

export const setStudentPassword = async (data) => {
  try {
    return await api.post('/api/auth/set-password', data);
  } catch (error) {
    throw error.data || { message: "Password setup failed" };
  }
};

export const loginStudent = async (data) => {
  try {
    return await api.post('/api/auth/login', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};

// Admin Authentication
export const loginAdmin = async (data) => {
  try {
    return await api.post('/api/auth/admin-login', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};

// Logout (shared)
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
