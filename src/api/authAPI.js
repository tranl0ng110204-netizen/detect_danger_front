import axiosClient from './axiosClient';

const authApi = {
  login: (email, password) => axiosClient.post('/auth/login', { email, password }),
  register: (data) => axiosClient.post('/auth/register', data),
  refreshToken: (refreshToken) => axiosClient.post('/auth/refresh', { refreshToken }),
  logout: () => axiosClient.post('/auth/logout'),
  getProfile: () => axiosClient.get('/auth/profile'),
};

export default authApi;