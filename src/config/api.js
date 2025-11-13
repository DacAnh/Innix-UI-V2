import axios from './axios-customize';

// Định nghĩa hàm login khớp với UserLoginRequest của Backend
export const callLogin = (email, password) => {
  return axios.post('/api/v2/auth/login', {
    email, // Khớp với field 'email' trong UserLoginRequest.java
    password, // Khớp với field 'password' trong UserLoginRequest.java
  });
};

// Thêm hàm này để lấy thông tin user khi F5 trang
export const callFetchAccount = () => {
  return axios.get('/api/v2/auth/account');
};

export const callLogout = () => {
  return axios.post('/api/v2/auth/logout');
};

// API Đăng ký tài khoản
export const callRegister = (userData) => {
  // userData là object chứa: { name, email, password, age, gender, address, phone }
  return axios.post('/api/v2/auth/register', userData);
};

// 1. Tạo mới User (POST /api/v2/users)
export const callCreateUser = (user) => {
  return axios.post('/api/v2/users', user);
};

// 2. Cập nhật User (PUT /api/v2/users - ID nằm trong body)
export const callUpdateUser = (user) => {
  return axios.put('/api/v2/users', user);
};

// 3. Xóa User (DELETE /api/v2/users/{id})
export const callDeleteUser = (id) => {
  return axios.delete(`/api/v2/users/${id}`);
};

// ... các API khác
