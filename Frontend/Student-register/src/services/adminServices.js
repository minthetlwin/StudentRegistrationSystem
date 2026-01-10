import axios from "axios";


export const loginAdmin = async (data) => {
  try {
    const response = await axios.post('/api/auth/admin-login', data);
    
    return response.data;
  } catch (error) {
    
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};


export const createAdmin = async (data) => {
  try {
    const response = await axios.post('/api/admin/add-admin', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to create admin";
    throw new Error(errorMessage);
  }
}

export const createSemester = async (data) => {
  try {
    const response = await axios.post('/api/admin/add-semester', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to create semester";
    throw new Error(errorMessage);
  }
}

export const getDormRegistrations = async () => {
  try {
    const response = await axios.get('/api/admin/dorm-registrations');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dorm registrations";
    throw new Error(errorMessage);
  }
}
