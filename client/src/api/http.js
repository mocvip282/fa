import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3001/api'
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('fa_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
