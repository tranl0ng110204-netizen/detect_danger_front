import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authAPI';
import { decodeJWT } from '../utils/jwtUtils';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      reputationScore:null,
      isAuthenticated: false,
      loading: false,
      role:null,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await authApi.login(email, password);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          const userInfo = decodeJWT(data.accessToken)
          console.log("userInfo:",userInfo)
          set({
            user: userInfo,
            token: data.accessToken,
            reputationScore:data?.reputationScore,
            isAuthenticated: true,
            role:userInfo?.role[0]?.authority || userInfo?.role[0],
            loading: false,
          });
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (userData) => {
        set({ loading: true });
        try {
          const { data } = await authApi.register(userData);
          set({ loading: false });
          return { success: true, data };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, role:null ,isAuthenticated: false, reputationScore:null });
      },

      fetchProfile: async () => { 
        try {
          const { data } = await authApi.getProfile();
          set({ user: data });
        } catch {
          // Nếu token hết hạn, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;