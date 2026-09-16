import { create } from 'zustand';
import adminApi from '../api/adminAPI';

const useRuleStore = create((set, get) => ({
  // ============ STATE ============
  rules: [],           // 👈 MẢNG thuần, không phải pageable
  loading: false,
  error: null,

  // ============ ACTIONS ============

  /**
   * Lấy toàn bộ danh sách rule (BE trả hết, FE tự phân trang)
   */
  fetchAllRules: async () => {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.getRules();

      // Chuẩn hóa: chấp nhận cả mảng thuần lẫn pageable cũ
      const raw = res?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.content)
        ? raw.content
        : [];

      set({ rules: list, loading: false });
      return list;
    } catch (err) {
      set({
        loading: false,
        error:
          err.response?.data?.message ||
          'Không thể tải danh sách quy tắc',
      });
      throw err;
    }
  },

  /**
   * Lấy chi tiết 1 rule theo ruleName (vì data không có id)
   */
  fetchRuleByName: async (ruleName) => {
    const local = get().rules.find((r) => r.ruleName === ruleName);
    if (local) return local;

    set({ loading: true, error: null });
    try {
      const res = await adminApi.getRuleByName?.(ruleName);
      set({ loading: false });
      return res?.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Không thể tải quy tắc',
      });
      throw err;
    }
  },

  /**
   * Tạo rule mới
   * @param {Object} payload { ruleName, inputType, ruleType, ruleStatus, weight, ruleValue, version, active }
   */
  createRule: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.createRule(payload);
      const created = res?.data ?? payload;

      // Nếu BE không trả về object đầy đủ thì fallback dùng payload
      const newRule = {
        ...payload,
        ...(typeof created === 'object' ? created : {}),
      };

      set((state) => ({
        rules: [newRule, ...state.rules],
        loading: false,
      }));
      return newRule;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Tạo quy tắc thất bại',
      });
      throw err;
    }
  },

  /**
   * Cập nhật rule theo ruleName
   */
  updateRule: async (ruleName, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.updateRule(ruleName, payload);

      set((state) => ({
        rules: state.rules.map((r) =>
          r.ruleName === ruleName ? { ...r, ...payload } : r
        ),
        loading: false,
      }));
      return res?.data ?? payload;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Cập nhật quy tắc thất bại',
      });
      throw err;
    }
  },

  /**
   * Xóa rule theo ruleName
   */
  deleteRule: async (ruleName) => {
    set({ loading: true, error: null });
    try {
      await adminApi.deleteRule(ruleName);

      set((state) => ({
        rules: state.rules.filter((r) => r.ruleName !== ruleName),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Xóa quy tắc thất bại',
      });
      throw err;
    }
  },

  /**
   * Bật / tắt nhanh 1 rule
   */
  toggleRuleActive: async (ruleName, active) => {
    const current = get().rules.find((r) => r.ruleName === ruleName);
    if (!current) return;

    try {
      await adminApi.updateRule?.(ruleName, { ...current, active });
      set((state) => ({
        rules: state.rules.map((r) =>
          r.ruleName === ruleName ? { ...r, active } : r
        ),
      }));
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Cập nhật trạng thái thất bại',
      });
      throw err;
    }
  },

  /**
   * Reset state khi logout
   */
  reset: () => set({ rules: [], loading: false, error: null }),
}));

export default useRuleStore;