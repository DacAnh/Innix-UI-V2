import axios from './axios-customize';

// === AUTH ===
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

// === USER ===
export const callCreateUser = (user) => axios.post('/api/v2/users', user);
export const callUpdateUser = (user) => axios.put('/api/v2/users', user);
export const callDeleteUser = (id) => axios.delete(`/api/v2/users/${id}`);
export const callFetchUser = (query) => axios.get(`/api/v2/users?${query}`);

// === PERMISSION ===
export const callCreatePermission = (data) =>
  axios.post('/api/v2/permissions', data);
export const callUpdatePermission = (data) =>
  axios.put('/api/v2/permissions', data);
export const callDeletePermission = (id) =>
  axios.delete(`/api/v2/permissions/${id}`);
export const callFetchPermission = (query) =>
  axios.get(`/api/v2/permissions?${query}`);

// === ROLE ===
export const callCreateRole = (data) => axios.post('/api/v2/roles', data);
export const callUpdateRole = (data) => axios.put('/api/v2/roles', data);
export const callDeleteRole = (id) => axios.delete(`/api/v2/roles/${id}`);
export const callFetchRole = (query) => axios.get(`/api/v2/roles?${query}`);
export const callFetchRoleById = (id) => axios.get(`/api/v2/roles/${id}`);

// === FILE UPLOAD ===
export const callUploadFile = (file, folder = 'others') => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('folder', folder);
  return axios({
    method: 'post',
    url: '/api/v2/files',
    data: bodyFormData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// === ACCOMMODATION TYPE ===
export const callCreateAccommodationType = (data) =>
  axios.post('/api/v2/accommodation-types', data);
export const callUpdateAccommodationType = (data, id) =>
  axios.put(`/api/v2/accommodation-types/${id}`, data);
export const callDeleteAccommodationType = (id) =>
  axios.delete(`/api/v2/accommodation-types/${id}`);
// export const callFetchAccommodationType = (query) =>
//   axios.get(`/api/v2/accommodation-types?${query}`);
export const callFetchAccommodationTypeById = (id) =>
  axios.get(`/api/v2/accommodation-types/${id}`);

// === ACCOMMODATION TYPE ===
export const callFetchAccommodationType = (query) =>
  axios.get(`/api/v2/accommodation-types?${query}`);

// === AMENITY (TIỆN ÍCH) ===
export const callFetchAmenities = (query) =>
  axios.get(`/api/v2/amenities?${query}`);

// === ACCOMMODATION (PUBLIC/ADMIN READ) ===
export const callFetchAllAccommodation = (query) =>
  axios.get(`/api/v2/accommodations?${query}`);
export const callFetchAccommodationById = (id) =>
  axios.get(`/api/v2/accommodations/${id}`);

// === PARTNER ACCOMMODATION (WRITE) ===
export const callFetchMyAccommodation = (query) =>
  axios.get(`/api/v2/partner/accommodations/me?${query}`);
export const callCreateAccommodation = (data) =>
  axios.post('/api/v2/partner/accommodations', data);
export const callUpdateAccommodation = (id, data) =>
  axios.put(`/api/v2/partner/accommodations/${id}`, data);
export const callDeleteAccommodation = (id) =>
  axios.delete(`/api/v2/partner/accommodations/${id}`);

// === PARTNER ROOM TYPE (Mới) ===
// URL: /api/v2/partner/accommodations/{accId}/room-types
export const callCreateRoomType = (accId, data) => {
  return axios.post(`/api/v2/partner/accommodations/${accId}/room-types`, data);
};

export const callUpdateRoomType = (accId, roomTypeId, data) => {
  return axios.put(
    `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}`,
    data
  );
};

export const callDeleteRoomType = (accId, roomTypeId) => {
  return axios.delete(
    `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}`
  );
};

export const callFetchRoomTypesByAccommodation = (accId, query) => {
  return axios.get(
    `/api/v2/partner/accommodations/${accId}/room-types?${query}`
  );
};

// API Upload ảnh cho RoomType
export const callUploadRoomTypeImage = (accId, roomTypeId, file) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  return axios({
    method: 'post',
    url: `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}/images`,
    data: bodyFormData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// API Update Availability (Giá/Tồn kho) - Sơ sơ
export const callUpdateRoomAvailability = (accId, roomTypeId, data) => {
  return axios.put(
    `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}/availability`,
    data
  );
};

// === AMENITY API (Chờ Backend thêm) ===
// export const callFetchAmenities = (query) =>
//   axios.get(`/api/v2/amenities?${query}`);

// === BOOKING API ===
export const callFetchBookings = (query) =>
  axios.get(`/api/v2/bookings?${query}`);
export const callUpdateBookingStatus = (id, data) =>
  axios.put(`/api/v2/bookings/status/${id}`, data);
