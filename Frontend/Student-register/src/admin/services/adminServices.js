import { api } from "../../utils/api";

// Admin Services
export const createAdmin = async (data) => {
  try {
    return await api.post('/api/admin/add-admin', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to create admin";
    throw new Error(errorMessage);
  }
};

export const createSemester = async (data) => {
  try {
    return await api.post('/api/admin/add-semester', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to create semester";
    throw new Error(errorMessage);
  }
};

export const getDormRegistrations = async () => {
  try {
    return await api.get('/api/admin/dorm-registrations');
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to fetch dorm registrations";
    throw new Error(errorMessage);
  }
};

export const updateDormStatus = async (id, statusData) => {
  try {
    return await api.put(`/api/admin/dorm-registrations/${id}/status`, statusData);
  } catch (error) {
    if (error.status === 409) {
      throw new Error('Registration has been updated by another admin');
    }
    const errorMessage = error.data?.message || error.message || "Failed to update status";
    throw new Error(errorMessage);
  }
};
