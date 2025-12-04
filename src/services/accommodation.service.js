import axios from '../config/axios-customize';

// === ACCOMMODATION TYPE ===
export const callCreateAccommodationType = (data) =>
  axios.post('/api/v2/accommodation-types', data);
export const callUpdateAccommodationType = (data, id) =>
  axios.put(`/api/v2/accommodation-types/${id}`, data);
export const callDeleteAccommodationType = (id) =>
  axios.delete(`/api/v2/accommodation-types/${id}`);
export const callFetchAccommodationType = (query) =>
  axios.get(`/api/v2/accommodation-types?${query}`);
export const callFetchAccommodationTypeById = (id) =>
  axios.get(`/api/v2/accommodation-types/${id}`);

// === AMENITY ===
export const callFetchAmenities = (query) =>
  axios.get(`/api/v2/amenities?${query}`);

// === ACCOMMODATION (PUBLIC/ADMIN READ) ===
export const callFetchAllAccommodation = (query) =>
  axios.get(`/api/v2/accommodations?${query}`);
export const callFetchPublicAccommodations = (query) =>
  axios.get(`/api/v2/accommodations?${query}`); // Alias
export const callFetchAccommodationById = (id) =>
  axios.get(`/api/v2/accommodations/${id}`);
export const callFetchPublicAccommodationById = (id) =>
  axios.get(`/api/v2/accommodations/${id}`); // Alias

// === PARTNER ACCOMMODATION (WRITE) ===
export const callFetchMyAccommodation = (query) =>
  axios.get(`/api/v2/partner/accommodations/me?${query}`);
export const callCreateAccommodation = (data) =>
  axios.post('/api/v2/partner/accommodations', data);
export const callUpdateAccommodation = (id, data) =>
  axios.put(`/api/v2/partner/accommodations/${id}`, data);
export const callDeleteAccommodation = (id) =>
  axios.delete(`/api/v2/partner/accommodations/${id}`);
