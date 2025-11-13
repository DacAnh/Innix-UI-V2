import axios from './axios-customize';

// Định nghĩa hàm login khớp với UserLoginRequest của Backend
export const callLogin = (email, password) => {
  return axios.post('/api/v2/auth/login', {
    email, // Khớp với field 'email' trong UserLoginRequest.java
    password, // Khớp với field 'password' trong UserLoginRequest.java
  });
};

export const callRegister = (userData) => {
  return axios.post('/users', userData);
};

// Thêm hàm này để lấy thông tin user khi F5 trang
export const callFetchAccount = () => {
  return axios.get('/api/v2/auth/account');
};

export const callLogout = () => {
  return axios.post('/api/v2/auth/logout');
};

// ... các API khác
