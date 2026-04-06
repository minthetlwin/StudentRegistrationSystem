import axios from "axios";

// Set up axios interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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

export const updateDormStatus = async (id, statusData) => {
  try {
    const response = await axios.put(`/api/admin/dorm-registrations/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('Registration has been updated by another admin');
    }
    const errorMessage = error.response?.data?.message || error.message || "Failed to update status";
    throw new Error(errorMessage);
  }
}


export const getNewAdmittedstudents = async (data)=>{
  try{
    const response = await axios.get(`/api/admin/new-admitted-studentlist`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to get New admitted Students";
    throw new Error(errorMessage);
  }
}

export const getCurrentstudents = async (data)=>{
  try{
    const response = await axios.get(`/api/admin/current-students`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to get Current Students";
    throw new Error(errorMessage);
  }
}

export const updateAdmittedStudentStatus = async (id, statusData) => {
  try {
    const response = await axios.put(`/api/admin/admitted-students/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to update status";
    throw new Error(errorMessage);
  }
}

export const updateStudent = async (id, data, type) => {
  try {
    const endpoint = type === 'admitted' ? 'admitted-students' : 'current-students';
    const response = await axios.put(`/api/admin/${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to update student";
    throw new Error(errorMessage);
  }
}

export const deleteStudent = async (id, type) => {
  try {
    const endpoint = type === 'admitted' ? 'admitted-students' : 'current-students';
    const response = await axios.delete(`/api/admin/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to delete student";
    throw new Error(errorMessage);
  }
}

export const addAdmittedStudent = async (data) => {
  try {
    const response = await axios.post('/api/admin/admitted-students', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to add student";
    throw new Error(errorMessage);
  }
}

export const addCurrentStudent = async (data) => {
  try {
    const response = await axios.post('/api/admin/current-students', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to add student";
    throw new Error(errorMessage);
  }
}

export const getStudentRegistrations = async () => {
  try {
    const response = await axios.get('/api/admin/student-registrations');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch student registrations";
    throw new Error(errorMessage);
  }
}

export const updateStudentRegistrationStatus = async (id, statusData) => {
  try {
    const response = await axios.put(`/api/admin/student-registrations/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to update registration status";
    throw new Error(errorMessage);
  }
}