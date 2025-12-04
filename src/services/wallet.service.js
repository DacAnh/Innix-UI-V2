import axios from '../config/axios-customize';

// === WALLET (Partner) ===
export const callFetchMyWallet = () => axios.get('/api/v2/wallet/me');
export const callFetchTransactions = (query) =>
  axios.get(`/api/v2/wallet/transactions?${query}`);
export const callRequestWithdraw = (data) =>
  axios.post('/api/v2/wallet/withdraw', data);

// === ADMIN TRANSACTION ===
export const callFetchAdminTransactions = (query) =>
  axios.get(`/api/v2/admin/transactions?${query}`);
export const callApproveWithdrawal = (id, data) =>
  axios.put(`/api/v2/admin/transactions/${id}/approve`, data);
export const callRejectWithdrawal = (id, data) =>
  axios.put(`/api/v2/admin/transactions/${id}/reject`, data);
