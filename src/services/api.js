import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://your-backend-api.com', // 替换为你的后端 API 地址
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // 登录
  login(payload) {
    return apiClient.post('/api/login', payload);
  },
  // 注册
  register(payload) {
    return apiClient.post('/api/register', payload);
  },
};