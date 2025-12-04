import axios from '../config/axios-customize';

// === PARTNER ROOM TYPE ===
export const callCreateRoomType = (accId, data) =>
  axios.post(`/api/v2/partner/accommodations/${accId}/room-types`, data);
export const callUpdateRoomType = (accId, roomTypeId, data) =>
  axios.put(
    `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}`,
    data
  );
export const callDeleteRoomType = (accId, roomTypeId) =>
  axios.delete(
    `/api/v2/partner/accommodations/${accId}/room-types/${roomTypeId}`
  );
export const callFetchRoomTypesByAccommodation = (accId, query) =>
  axios.get(`/api/v2/partner/accommodations/${accId}/room-types?${query}`);

// === PUBLIC ROOM TYPE ===
export const callFetchPublicRoomTypes = (accommodationId, query) =>
  axios.get(`/api/v2/accommodations/${accommodationId}/room-types?${query}`);

// === ROOM IMAGE ===
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

// === AVAILABILITY (Lịch giá) ===
export const callFetchRoomAvailability = (roomTypeId, startDate, endDate) => {
  return axios.get(
    `/api/v2/partner/room-availability?roomTypeId=${roomTypeId}&startDate=${startDate}&endDate=${endDate}`
  );
};

export const callUpdateRoomAvailability = (data) => {
  return axios.post(`/api/v2/partner/room-availability`, data);
};
