import axiosClient from './axiosClient';

const reportApi = {
  // User
  createReport: (data,token) => axiosClient.post('/reports/create', data,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  }),
  getMyReports: (token) => axiosClient.get('/reports/my',{
    headers:{
      Authorization: `Bearer ${token}`
    }
  }),
  getReportById: (id) => axiosClient.get(`/reports/${id}`), 
   deleteReport: (id) => axiosClient.delete(`/reports/delete/${id}`),

  //================= Moderator =====================

  getPendingReports: () => axiosClient.get('/moderator/reports/checking'),

  getReportDetail:(id) => axiosClient.get(`/moderator/reports/${id}`),

  reviewReport: (id) => axiosClient.patch(`/moderator/reports/${id}/review`),
  verifyReportStatus: (id,reason) => axiosClient.patch(`/moderator/reports/${id}/verify`,reason),
  rejectReportStatus: (id,reason) => axiosClient.patch(`/moderator/reports/${id}/reject`,reason),

  // Admin
  getAllReports: (params) => axiosClient.get('/admin/reports', { params }),
  checkReportAgain:(id,reason) => axiosClient.patch(`/admin/reports/${id}`,reason)
 
};

export default reportApi;