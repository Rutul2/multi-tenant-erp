import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/authSlice.js';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point this to your Express backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the token to every outgoing request
api.interceptors.request.use(
  (config) => {
    // Access the Redux store to get the current user's token
    const token = store.getState().auth.userInfo?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle expired tokens globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns a 401 Unauthorized, automatically log the user out
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;