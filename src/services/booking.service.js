import axios from '../config/axios-customize';

// === BOOKING ===
export const callCreateBooking = (data) => axios.post('/api/v2/bookings', data);
export const callFetchBookings = (query) =>
  axios.get(`/api/v2/bookings?${query}`);
export const callUpdateBookingStatus = (id, data) =>
  axios.put(`/api/v2/bookings/status/${id}`, data);
export const callCheckRoomAvailability = (data) =>
  axios.post('/api/v2/bookings/check-availability', data);

// === PAYMENT ===
export const callCreateVnPayUrl = (bookingId) =>
  axios.post(`/api/v2/payment/create-vnpay-url?bookingId=${bookingId}`);
export const callCreatePaymentUrl = (data) =>
  axios.get(
    `/api/v2/payment/create_payment_url?amount=${data.amount}&orderInfo=${data.orderInfo}&returnUrl=${data.returnUrl}`
  ); // (API cũ)
export const callPaymentCallback = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return axios.get(`/api/v2/payment/vnpay-payment?${queryString}`);
};
