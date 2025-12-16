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
