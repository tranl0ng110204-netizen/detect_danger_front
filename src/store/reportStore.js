import { create } from 'zustand';
import reportApi from '../api/reportAPI';

const useReportStore = create((set, get) => ({
  reports: [],
  pendingReports: [],
  currentReport: null,
  loading: false,

  // User
  fetchMyReports: async (token) => {
    const data = get().reports
    if(data.length > 0){
      return
    }
    set({ loading: true });
    try {
      const { data } = await reportApi.getMyReports(token);
      console.log(data)
      set({ reports: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createReport: async (reportData) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.createReport(reportData);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchReportById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.getReportById(id);
      set({ currentReport: data, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },deleteMyReport: async (id) => {
    set({ loading: true });
    try {
      await reportApi.deleteReport(id);
      set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Moderator

  getReportDetail: async(id)=>{
    set({loading:true})
    try{
      const { data } = await reportApi.getReportDetail(id)
      set({currentReport:data, loading:false})
    }
    catch(error){
      set({loading:false})
      throw error
    }
  },
  fetchPendingReports: async () => {
    set({ loading: true });
    try {
      const { data } = await reportApi.getPendingReports();
      set({ pendingReports: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
   startReview: async (id,token) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.reviewReport(id,token);
      console.log(data)
      set({ currentReport: data, loading: false });
      set((state) => ({
        pendingReports: state.pendingReports.filter((r) => r.id !== id),
      }));
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  verifyReportStatus: async (id,reason) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.verifyReportStatus(id,{reason});
      // Cập nhật local state
      const updated = data;
      set((state) => ({
        pendingReports: state.pendingReports.filter((r) => r.id !== id),
        currentReport: updated,
        loading: false,
      }));
      return updated;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  rejectReportStatus: async (id,reason) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.rejectReportStatus(id,{reason});
      // Cập nhật local state
      const updated = data;
      set((state) => ({
        pendingReports: state.pendingReports.filter((r) => r.id !== id),
        currentReport: updated,
        loading: false,
      }));
      return updated;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Admin
  fetchAllReports: async (params) => {
    set({ loading: true });
    try {
      const { data } = await reportApi.getAllReports(params);
      set({ reports: data, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
   updateReport: async (id, data) => {
     const response = await reportApi.checkReportAgain(id, data);
     set((state) => ({
       reports: {
         ...state.reports,
         content: state.reports.content.map((r) =>
           r.id === id ? { ...r, ...data } : r
         ),
       },
     }));
     return response.data;
   },

  
}));

export default useReportStore;