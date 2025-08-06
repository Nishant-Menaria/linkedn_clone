// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Your backend URL
  withCredentials: true, // 🔑 Enables sending cookies
});

export default axiosInstance;
