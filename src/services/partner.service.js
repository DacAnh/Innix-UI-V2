import axios from '../config/axios-customize';

export const callCreatePartnerProfile = (data) =>
  axios.post('/api/v2/partner-profile', data);
// ... các api contract nếu có ...
