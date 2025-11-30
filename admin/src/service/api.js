import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agency API
export const agencyAPI = {
  getAll: () => api.get('/admin/agencies'),
  getPending: () => api.get('/admin/agencies/pending'),
  getById: (id) => api.get(`/agency/${id}`),
  create: (data) => api.post('/agency', data),
  update: (id, data) => api.put(`/agency/${id}`, data),
  delete: (id) => api.delete(`/agency/${id}`),
  approve: (agencyId) => api.post(`/admin/agency/${agencyId}/approve`),
  reject: (agencyId) => api.post(`/admin/agency/${agencyId}/reject`),
};

// Hosts API
export const hostsAPI = {
  getAll: () => api.get('/admin/hosts'),
  getByAgency: (agencyId) => api.get(`/admin/hosts?agency=${agencyId}`),
  getById: (id) => api.get(`/hosts/${id}`),
  approve: (hostId) => api.post(`/admin/host/${hostId}/approve`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateBalance: (id, amount) => api.put(`/users/${id}/balance`, { amount }),
  ban: (userId) => api.post(`/admin/user/${userId}/ban`),
  unban: (userId) => api.post(`/admin/user/${userId}/unban`),
};

// Gifts API
export const giftsAPI = {
  getAll: () => api.get('/gifts'),
  create: (data) => api.post('/gifts', data),
  update: (id, data) => api.put(`/gifts/${id}`, data),
  delete: (id) => api.delete(`/gifts/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api. post('/gifts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Mall API
export const mallAPI = {
  getAll: () => api.get('/mall'),
  create: (data) => api.post('/mall', data),
  update: (id, data) => api.put(`/mall/${id}`, data),
  delete: (id) => api.delete(`/mall/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api. post('/mall/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDailyStats: () => api.get('/admin/hosts/stats/daily'),
  getWeeklyStats: () => api.get('/admin/hosts/stats/weekly'),
  getMonthlyStats: () => api.get('/admin/hosts/stats/monthly'),
};

// Super Admin API
export const superAdminAPI = {
  transferCoin: (data) => api.post('/super-admin/transfer-coin', data),
  getJPSettings: () => api.get('/super-admin/jp-settings'),
  updateJPSettings: (data) => api.post('/super-admin/jp-settings', data),
  verifySuperAdmin: () => api.get('/super-admin/verify'),
};

export default api;