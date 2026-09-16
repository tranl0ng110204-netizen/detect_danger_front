import axios from 'axios';
import axiosClient from './axiosClient';

const adminApi = {
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),
  createUser: (data) => axiosClient.post('/admin/users', data),
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  getAuditLogs: (params) => axiosClient.get('/admin/audits', { params }),
  getRules: () => axiosClient.get('/admin/rules/all')
};

export default adminApi;