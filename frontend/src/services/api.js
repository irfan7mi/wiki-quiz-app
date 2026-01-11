import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://wiki-quiz-app-sxmx.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateQuiz = async (url) => {
  try {
    const response = await api.post('/generate', { url });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate quiz');
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch history');
  }
};

export default api;

