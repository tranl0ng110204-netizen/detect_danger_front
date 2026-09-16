import { create } from 'zustand';
import scanApi from '../api/scanAPI';

const useScanStore = create((set, get) => ({
  scanResult: null,
  scanLoading: false,
  error: null,
  scanHistories:[],

  // Gọi API scan text thông thường
  performScan: async (data) => {
    set({ scanLoading: true, loading: true, error: null });
    try {
      const response = await scanApi.createScan(data);
      set({ scanResult: response.data, scanLoading: false, loading: false });
      return response.data;
    } catch (error) {
      set({ scanLoading: false, loading: false, error: error.response?.data?.message || 'Scan thất bại' });
      throw error;
    }
  },

  // Gọi API scan file PDF
  performScanPdf: async (file) => {
    set({ scanLoading: true, loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await scanApi.scanFilePdf(formData);
      set({ scanResult: response.data, scanLoading: false, loading: false });
      return response.data;
    } catch (error) {
      set({ scanLoading: false, loading: false, error: error.response?.data?.message || 'Quét tệp PDF thất bại' });
      throw error;
    }
  },

  // Reset kết quả scan
  clearScanResult: () => set({ scanResult: null, error: null }),

  //Lấy tất cả các scan của người dùng
    getScanHistory: async () => {
    const data = get().scanHistories
    if(data.length > 0){
        return
    }
    set({ loading: true, error: null });
    try {
      const response = await scanApi.getScans();
      set({ scanHistories: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Lấy lịch sử thất bại' });
      throw error;
    }
  },

}));

export default useScanStore;