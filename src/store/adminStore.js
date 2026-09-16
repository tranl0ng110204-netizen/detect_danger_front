import { create } from 'zustand';
import  adminApi from "../api/adminAPI"

const useAdminStore = create((set) => ({
  users: [], // mặc định là mảng rỗng
  audits: [],
  loading: false,

// ==================== user ================
  fetchUsers: async (params) => {
    set({ loading: true });
    try {
      const { data } = await adminApi.getUsers(params);
      // Đảm bảo data là mảng
      set({ users: data?.content ,loading:false});
    } catch (error) {
      console.error('fetchUsers error:', error);
      set({ users: [], loading: false });
      throw error;
    }
  },

  createUser: async (userData) => {
    set({ loading: true });
    try {
      const { data } = await adminApi.createUser(userData);
      set((state) => ({ users: [...state.users, data], loading: false }));
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true });
    try {
      const { data } = await adminApi.updateUser(id, userData);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? data : u)),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true });
    try {
      await adminApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchAuditLogs: async (params) => {
    set({ loading: true });
    try {
      const { data } = await adminApi.getAuditLogs(params);
      set({ audits: data || [], loading: false });
    } catch (error) {
      set({ audits: [], loading: false });
      throw error;
    }
  },
}));

export default useAdminStore;