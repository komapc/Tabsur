import axios from "axios";

// Add request interceptor to log all outgoing requests
axios.interceptors.request.use(
  (config) => {
    console.log("🚀 Outgoing request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      auth: config.headers?.Authorization ? `${config.headers.Authorization.substring(0, 20)}...` : 'None',
      fullAuth: config.headers?.Authorization || 'None'
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
    
    // Handle JWT signature errors by clearing invalid tokens
    if (error.response?.status === 403 && error.response?.data?.name === 'JsonWebTokenError') {
      console.warn("🔐 JWT signature error detected - clearing invalid token");
      localStorage.removeItem("jwtToken");
      delete axios.defaults.headers.common["Authorization"];
      
      // Redirect to login if we're not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    // Check if token already has "Bearer " prefix to avoid double prefixing
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = authHeader;
    console.log("🔑 Auth token set:", `${authHeader.substring(0, 30)}...`);
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

// Function to run sanity check on server
export const runServerSanityCheck = async () => {
  try {
    const response = await axios.get('http://localhost:5000/sanity-check');
    console.log("🔍 Server Sanity Check:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Server Sanity Check Failed:", error);
    return null;
  }
};

// Function to clear invalid authentication
export const clearInvalidAuth = () => {
  console.log("🧹 Clearing invalid authentication");
  localStorage.removeItem("jwtToken");
  delete axios.defaults.headers.common["Authorization"];
  window.location.href = '/login';
};

// Function to clean up malformed tokens
export const cleanupToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (token && token.startsWith('Bearer ')) {
    // Remove the "Bearer " prefix if it exists
    const cleanToken = token.replace('Bearer ', '');
    localStorage.setItem("jwtToken", cleanToken);
    console.log("🧹 Cleaned up malformed token, removed 'Bearer ' prefix");
    return cleanToken;
  }
  return token;
};

export default setAuthToken;
