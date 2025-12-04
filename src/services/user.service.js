import axios from '../config/axios-customize';

export const callCreateUser = (user) => axios.post('/api/v2/users', user);
export const callUpdateUser = (user) => axios.put('/api/v2/users', user);
export const callDeleteUser = (id) => axios.delete(`/api/v2/users/${id}`);
export const callFetchUser = (query) => axios.get(`/api/v2/users?${query}`);
