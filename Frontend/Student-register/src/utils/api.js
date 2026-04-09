/**
 * Standardized API utility using the native Fetch API.
 * Handles token management, headers, and error parsing.
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  get: async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  post: async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (url, body) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  patch: async (url, body) => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
