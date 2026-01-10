import axios from "axios";

const API_BASE_URL = '';
console.log('🔗 Using proxy for API calls');


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchDashboardData = async () => {
  const res = await axios.get(`/api/auth/dashboard`, {
    headers: getAuthHeaders(),
  });
  return res.data.student;
};

export const fetchNotifications = async () => {
  const res = await axios.get(`/api/auth/notifications`, {
    headers: getAuthHeaders(),
  });
  return res.data.notifications;
};

export const registerForDorm = async (data) => {
  try {
    const response = await axios.post('/api/student/dorm/register', data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Dorm registration failed" };
  }
};
