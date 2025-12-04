import axios from '../config/axios-customize';

// === USER ===
export const callCreateUser = (user) => axios.post('/api/v2/users', user);
export const callUpdateUser = (user) => axios.put('/api/v2/users', user);
export const callDeleteUser = (id) => axios.delete(`/api/v2/users/${id}`);
export const callFetchUser = (query) => axios.get(`/api/v2/users?${query}`);

// === ROLE ===
export const callCreateRole = (data) => axios.post('/api/v2/roles', data);
export const callUpdateRole = (data) => axios.put('/api/v2/roles', data);
export const callDeleteRole = (id) => axios.delete(`/api/v2/roles/${id}`);
export const callFetchRole = (query) => axios.get(`/api/v2/roles?${query}`);
export const callFetchRoleById = (id) => axios.get(`/api/v2/roles/${id}`);

// === PERMISSION ===
export const callCreatePermission = (data) =>
  axios.post('/api/v2/permissions', data);
export const callUpdatePermission = (data) =>
  axios.put('/api/v2/permissions', data);
export const callDeletePermission = (id) =>
  axios.delete(`/api/v2/permissions/${id}`);
export const callFetchPermission = (query) =>
  axios.get(`/api/v2/permissions?${query}`);
