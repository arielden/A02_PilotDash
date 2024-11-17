import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Reemplaza con la URL de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
