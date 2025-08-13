import axios from "axios";

// Add request interceptor to log all outgoing requests
axios.interceptors.request.use(
  (config) => {
    console.log("🚀 Outgoing request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      auth: config.headers?.Authorization ? `${config.headers.Authorization.substring(0, 20)}...` : 'None'
    });
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log all responses
axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("🔑 Auth token set:", `Bearer ${token.substring(0, 20)}...`);
    console.log("🔍 Current axios headers:", axios.defaults.headers.common);
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
    console.log("🗑️ Auth token removed");
    console.log("🔍 Current axios headers:", axios.defaults.headers.common);
  }
};

// Function to check current auth state
export const checkAuthState = () => {
  const token = localStorage.getItem("jwtToken");
  const headers = axios.defaults.headers.common;
  
  console.log("🔍 Auth State Check:", {
    localStorageToken: token ? `${token.substring(0, 20)}...` : 'None',
    axiosHeaders: headers,
    authorizationHeader: headers.Authorization || 'None'
  });
  
  return {
    hasToken: !!token,
    hasHeader: !!headers.Authorization,
    token: token,
    header: headers.Authorization
  };
};

export default setAuthToken;
