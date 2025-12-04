import axios from '../config/axios-customize';

export const callLogin = (email, password) => {
  return axios.post('/api/v2/auth/login', { email, password });
};

export const callRegister = (userData) => {
  return axios.post('/api/v2/auth/register', userData);
};

export const callFetchAccount = () => {
  return axios.get('/api/v2/auth/account');
};

export const callLogout = () => {
  return axios.post('/api/v2/auth/logout');
};

export const callSendVerificationCode = (email) => {
  return axios.post('/api/v2/auth/send-verification', { email });
};

export const callCheckEmail = (email) => {
  return axios.post('/api/v2/auth/check-email', { email });
};

export const callForgotPassword = (data) => {
  return axios.post('/api/v2/auth/forgot-password', data);
};

export const callChangePassword = (data) => {
  return axios.post('/api/v2/auth/change-password', data);
};
