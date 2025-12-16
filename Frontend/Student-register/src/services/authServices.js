import axios from "axios";

// const VITE_API_URL = import.meta.env.VITE_API_URL;

export const verifyStudent = async (data) => {
  try {
    const payload = {
      enrollment_number: data.admissionNumber,
      nrc: data.nrcNumber,
      date_of_birth: data.dateOfBirth,
      g12_exam_id: data.g12ExamId || undefined
    };
    console.log('Making request to:', '/api/auth/verify-admitted');
    const response = await axios.post('/api/auth/verify-admitted', payload);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: "Verification failed" };
  }
};

export const setStudentPassword = async (data) => {
  try {
    const response = await axios.post('/api/auth/set-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Password setup failed" };
  }
};

export const loginStudent = async (data) => {
  try {
    const response = await axios.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
  
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};
