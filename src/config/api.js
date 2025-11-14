import axios from './axios-customize';

// Login
export const callLogin = (email, password) => {
  return axios.post('/api/v2/auth/login', {
    email,
    password,
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

// URL: /api/v2/permissions
export const callCreatePermission = (data) => {
  return axios.post('/api/v2/permissions', data);
};

export const callUpdatePermission = (data) => {
  return axios.put('/api/v2/permissions', data);
};

export const callDeletePermission = (id) => {
  return axios.delete(`/api/v2/permissions/${id}`);
};

export const callFetchPermission = (query) => {
  // query ví dụ: page=1&size=10
  return axios.get(`/api/v2/permissions?${query}`);
};

// ==========================
// ROLE API
// ==========================
// URL: /api/v2/roles
export const callCreateRole = (data) => {
  return axios.post('/api/v2/roles', data);
};

export const callUpdateRole = (data) => {
  return axios.put('/api/v2/roles', data);
};

export const callDeleteRole = (id) => {
  return axios.delete(`/api/v2/roles/${id}`);
};

export const callFetchRole = (query) => {
  return axios.get(`/api/v2/roles?${query}`);
};

export const callFetchRoleById = (id) => {
  return axios.get(`/api/v2/roles/${id}`);
};

// === ACCOMMODATION TYPE API ===
// URL: /api/v2/accommodation-types
export const callCreateAccommodationType = (data) => {
  return axios.post('/api/v2/accommodation-types', data);
};

export const callUpdateAccommodationType = (data, id) => {
  return axios.put(`/api/v2/accommodation-types/${id}`, data);
};

export const callDeleteAccommodationType = (id) => {
  return axios.delete(`/api/v2/accommodation-types/${id}`);
};

export const callFetchAccommodationType = (query) => {
  return axios.get(`/api/v2/accommodation-types?${query}`);
};

export const callFetchAccommodationTypeById = (id) => {
  return axios.get(`/api/v2/accommodation-types/${id}`);
};

// === FILE UPLOAD API ===
// Upload file đơn lẻ
export const callUploadFile = (file, folder = 'others') => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('folder', folder);

  return axios({
    method: 'post',
    url: '/api/v2/files',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ... các API khác
