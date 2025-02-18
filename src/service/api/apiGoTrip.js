import axios from 'axios';
import { getToken } from '../../utils/utils';

const apiGoTrip = axios.create({
  baseURL: 'http://localhost:7070/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiGoTrip.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiGoTrip.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default apiGoTrip;
