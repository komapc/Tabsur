import axios from "axios";
import config from "../config";

// Queue for requests that failed with 401 while a refresh is in flight
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Add request interceptor to log all outgoing requests
axios.interceptors.request.use(
  (cfg) => {
    console.log("🚀 Outgoing request:", {
      method: cfg.method?.toUpperCase(),
      url: cfg.url,
      auth: cfg.headers?.Authorization ? `${cfg.headers.Authorization.substring(0, 20)}...` : 'None',
    });
    return cfg;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor — handles 401 (expired) and 403 (bad signature)
axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", {
      status: response.status,
      url: response.config.url,
      size: typeof response.data === 'string' ? response.data.length : 'object'
    });
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // 401 = token expired — attempt silent refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/users/refresh') &&
      !originalRequest.url?.includes('/api/users/login')
    ) {
      if (isRefreshing) {
        // Queue this request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = token;
          return axios(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post(`${config.SERVER_HOST}/api/users/refresh`, {}, { withCredentials: true })
          .then(res => {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            axios.defaults.headers.common['Authorization'] = token;
            originalRequest.headers['Authorization'] = token;
            processQueue(null, token);
            resolve(axios(originalRequest));
          })
          .catch(refreshError => {
            processQueue(refreshError, null);
            // Refresh failed — clear session
            localStorage.removeItem('jwtToken');
            delete axios.defaults.headers.common['Authorization'];
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
              window.location.href = '/login';
            }
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // 403 = invalid token signature — clear and redirect
    if (error.response?.status === 403 && error.response?.data?.name === 'JsonWebTokenError') {
      console.warn("🔐 JWT signature error detected - clearing invalid token");
      localStorage.removeItem("jwtToken");
      delete axios.defaults.headers.common["Authorization"];
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }

    console.error("❌ Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const setAuthToken = token => {
  if (token) {
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = authHeader;
    console.log("🔑 Auth token set");
  } else {
    delete axios.defaults.headers.common["Authorization"];
    console.log("🗑️ Auth token removed");
  }
};

export const checkAuthState = () => {
  const token = localStorage.getItem("jwtToken");
  const headers = axios.defaults.headers.common;
  return {
    hasToken: !!token,
    hasHeader: !!headers.Authorization,
    token: token,
    header: headers.Authorization
  };
};

export const runServerSanityCheck = async () => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/sanity-check`);
    console.log("🔍 Server Sanity Check:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Server Sanity Check Failed:", error);
    return null;
  }
};

export const clearInvalidAuth = () => {
  console.log("🧹 Clearing invalid authentication");
  localStorage.removeItem("jwtToken");
  delete axios.defaults.headers.common["Authorization"];
  window.location.href = '/login';
};

export const cleanupToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (token && token.startsWith('Bearer ')) {
    const cleanToken = token.replace('Bearer ', '');
    localStorage.setItem("jwtToken", cleanToken);
    console.log("🧹 Cleaned up malformed token, removed 'Bearer ' prefix");
    return cleanToken;
  }
  return token;
};

export default setAuthToken;
