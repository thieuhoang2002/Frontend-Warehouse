import axios from "axios";

/**
 * Axios instance tự động gắn JWT Authorization header cho mọi request.
 * Sử dụng file này thay vì import axios trực tiếp trong các API service.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor: tự động gắn Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.accessToken) {
      config.headers["Authorization"] = "Bearer " + user.accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: tự redirect về login nếu token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
