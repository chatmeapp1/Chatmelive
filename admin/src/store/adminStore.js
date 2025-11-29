import { create } from 'zustand';
import * as APIs from '../service/api';

export const useAdminStore = create((set, get) => ({
  // ============ STATE ============
  agencies: [],
  hosts: [],
  users: [],
  gifts: [],
  mall: [],
  loading: false,
  error: null,

  // ============ AGENCIES ============
  fetchAgencies: async () => {
    set({ loading: true });
    try {
      const { data } = await APIs.agencyAPI.getAll();
      set({ agencies: data, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addAgency: async (agencyData) => {
    try {
      await APIs.agencyAPI.create(agencyData);
      get().fetchAgencies();
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteAgency: async (id) => {
    try {
      await APIs.agencyAPI.delete(id);
      get().fetchAgencies();
    } catch (err) {
      set({ error: err.message });
    }
  },

  approveAgency: async (agencyId) => {
    try {
      await APIs.agencyAPI.approve(agencyId);
      get().fetchAgencies();
    } catch (err) {
      set({ error: err.message });
    }
  },

  rejectAgency: async (agencyId) => {
    try {
      await APIs.agencyAPI.reject(agencyId);
      get().fetchAgencies();
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ============ HOSTS ============
  fetchHosts: async (agencyId = null) => {
    set({ loading: true });
    try {
      const { data } = agencyId
        ? await APIs.hostsAPI.getByAgency(agencyId)
        : await APIs.hostsAPI.getAll();
      set({ hosts: data, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  approveHost: async (hostId) => {
    try {
      await APIs.hostsAPI.approve(hostId);
      get().fetchHosts();
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ============ USERS ============
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await APIs.usersAPI.getAll();
      set({ users: data, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  banUser: async (userId) => {
    try {
      await APIs.usersAPI.ban(userId);
      get().fetchUsers();
    } catch (err) {
      set({ error: err.message });
    }
  },

  unbanUser: async (userId) => {
    try {
      await APIs.usersAPI.unban(userId);
      get().fetchUsers();
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ============ GIFTS ============
  fetchGifts: async () => {
    set({ loading: true });
    try {
      const { data } = await APIs.giftsAPI.getAll();
      set({ gifts: data, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addGift: async (giftData) => {
    try {
      await APIs.giftsAPI.create(giftData);
      get().fetchGifts();
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteGift: async (id) => {
    try {
      await APIs.giftsAPI.delete(id);
      get().fetchGifts();
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ============ MALL ============
  fetchMall: async () => {
    set({ loading: true });
    try {
      const { data } = await APIs.mallAPI.getAll();
      set({ mall: data, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addMallItem: async (itemData) => {
    try {
      await APIs.mallAPI.create(itemData);
      get().fetchMall();
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteMallItem: async (id) => {
    try {
      await APIs.mallAPI.delete(id);
      get().fetchMall();
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ============ SUPER ADMIN ============
  transferCoin: async (toUserId, amount, reason) => {
    try {
      await APIs.superAdminAPI.transferCoin({ toUserId, amount, reason });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  getJPSettings: async () => {
    try {
      const { data } = await APIs.superAdminAPI.getJPSettings();
      return data.data;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  updateJPSettings: async (settings) => {
    try {
      await APIs.superAdminAPI.updateJPSettings(settings);
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false };
    }
  },
}));
