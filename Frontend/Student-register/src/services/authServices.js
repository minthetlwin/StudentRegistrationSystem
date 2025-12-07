// services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/auth";

export const verifyStudent = async (data) => {
  try {
    const payload = {
      enrollment_number: data.admissionNumber,
      nrc: data.nrcNumber,
      date_of_birth: data.dateOfBirth,
      g12_exam_id: data.g12ExamId || undefined
    };
    // console.log('Sending to backend:', payload);
    const response = await axios.post(`${API_BASE_URL}/verify-admitted`, payload);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: "Verification failed" };
  }
};


export const setStudentPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/set-password`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Password setup failed" };
  }
};