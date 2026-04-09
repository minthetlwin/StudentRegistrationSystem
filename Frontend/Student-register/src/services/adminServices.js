import { api } from "../utils/api";

export const loginAdmin = async (data) => {
  try {
    return await api.post('/api/auth/admin-login', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const createAdmin = async (data) => {
  try {
    return await api.post('/api/admin/add-admin', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to create admin";
    throw new Error(errorMessage);
  }
}

export const createSemester = async (data) => {
  try {
    return await api.post('/api/admin/add-semester', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to create semester";
    throw new Error(errorMessage);
  }
}

export const getDormRegistrations = async () => {
  try {
    return await api.get('/api/admin/dorm-registrations');
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to fetch dorm registrations";
    throw new Error(errorMessage);
  }
}

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
}

export const getNewAdmittedstudents = async (data)=>{
  try{
    return await api.get(`/api/admin/new-admitted-studentlist`);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to get New admitted Students";
    throw new Error(errorMessage);
  }
}

export const getCurrentstudents = async (data)=>{
  try{
    return await api.get(`/api/admin/current-students`);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to get Current Students";
    throw new Error(errorMessage);
  }
}

export const updateAdmittedStudentStatus = async (id, statusData) => {
  try {
    return await api.put(`/api/admin/admitted-students/${id}/status`, statusData);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to update status";
    throw new Error(errorMessage);
  }
}

export const updateStudent = async (id, data, type) => {
  try {
    const endpoint = type === 'admitted' ? 'admitted-students' : 'current-students';
    return await api.put(`/api/admin/${endpoint}/${id}`, data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to update student";
    throw new Error(errorMessage);
  }
}

export const deleteStudent = async (id, type) => {
  try {
    const endpoint = type === 'admitted' ? 'admitted-students' : 'current-students';
    return await api.delete(`/api/admin/${endpoint}/${id}`);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to delete student";
    throw new Error(errorMessage);
  }
}

export const addAdmittedStudent = async (data) => {
  try {
    return await api.post('/api/admin/admitted-students', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to add student";
    throw new Error(errorMessage);
  }
}

export const addCurrentStudent = async (data) => {
  try {
    return await api.post('/api/admin/current-students', data);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to add student";
    throw new Error(errorMessage);
  }
}

export const getStudentRegistrations = async () => {
  try {
    return await api.get('/api/admin/student-registrations');
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to fetch student registrations";
    throw new Error(errorMessage);
  }
}

export const updateStudentRegistrationStatus = async (id, statusData) => {
  try {
    return await api.put(`/api/admin/student-registrations/${id}/status`, statusData);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to update registration status";
    throw new Error(errorMessage);
  }
}

export const getPayments = async () => {
  try {
    return await api.get('/api/admin/payments');
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to fetch payments";
    throw new Error(errorMessage);
  }
}

export const updatePaymentStatus = async (id, statusData) => {
  try {
    return await api.put(`/api/admin/payments/${id}/status`, statusData);
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to update payment status";
    throw new Error(errorMessage);
  }
}

export const getPaymentSettings = async () => {
  try {
    return await api.get('/api/admin/payments/settings');
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to fetch payment settings";
    throw new Error(errorMessage);
  }
}

export const updatePaymentSettings = async (feeBreakdown) => {
  try {
    return await api.put('/api/admin/payments/settings', { feeBreakdown });
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to update payment settings";
    throw new Error(errorMessage);
  }
}