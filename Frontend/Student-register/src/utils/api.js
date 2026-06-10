/**
 * Standardized API utility using the native Fetch API.
 * Handles token management, headers, error parsing, and 401 auto-redirect.
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

/**
 * Handle 401 responses globally — clear auth state and redirect to login.
 */
const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  // Only redirect if not already on a public page
  if (
    !window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/admin-login") &&
    !window.location.pathname.includes("/register") &&
    window.location.pathname !== "/"
  ) {
    window.location.href = "/login";
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Auto-redirect on 401 (expired / invalid token)
    if (response.status === 401) {
      handleUnauthorized();
    }

    // Build a rich error object that preserves status + server data
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
