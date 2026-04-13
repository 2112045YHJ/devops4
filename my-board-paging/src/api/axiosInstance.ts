import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/board',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
