import axios from '../config/axios-customize';

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
