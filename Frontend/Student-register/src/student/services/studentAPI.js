import { api } from "../../utils/api";

// Student Dashboard
export const fetchDashboardData = async () => {
  try {
    const res = await api.get(`/api/auth/dashboard`);
    return res.student;
  } catch (error) {
    console.error("Fetch dashboard error:", error);
    throw error;
  }
};

// Student Notifications
export const fetchNotifications = async () => {
  try {
    const res = await api.get(`/api/auth/notifications`);
    return res.notifications;
  } catch (error) {
    console.error("Fetch notifications error:", error);
    throw error;
  }
};

// Student Dormitory Registration
export const registerForDorm = async (data) => {
  try {
    return await api.post('/api/student/dorm/register', data);
  } catch (error) {
    throw error.data || { message: "Dorm registration failed" };
  }
};

// Student List (for verification)
export const studentList = async () => {
  try {
    return await api.get('/api/student/list');
  } catch (error) {
    throw error.data || { message: "Fetching student list failed" };
  }     
};

// Student Registration
export const registerStudent = async (registrationData) => {
  try {
    return await api.post('/api/student/register', registrationData);
  } catch (error) {
    throw error.data || { message: "Student registration failed" };
  }
};

// Student Registration Status
export const getMyRegistrationStatus = async () => {
  try {
    return await api.get('/api/student/registration-status');
  } catch (error) {
    throw error.data || { message: "Fetching registration status failed" };
  }
};

// Student Payment Status
export const getPaymentStatus = async () => {
  try {
    return await api.get('/api/student/payment-status');
  } catch (error) {
    throw error.data || { message: "Fetching payment status failed" };
  }
};

// Student Payment Submission
export const submitPayment = async (data) => {
  try {
    return await api.post('/api/student/payment', data);
  } catch (error) {
    throw error.data || { message: "Payment submission failed" };
  }
};
