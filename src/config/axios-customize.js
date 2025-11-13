import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Ví dụ: http://localhost:8080/api/v1
  withCredentials: true, // Để nhận cookies nếu backend có gửi
});

// Gửi Token đi kèm trong mỗi request (nếu đã đăng nhập)
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Xử lý dữ liệu trả về (Giống abc: chỉ lấy phần data cần thiết)
instance.interceptors.response.use(
  function (response) {
    // Backend trả về: { code: 1000, result: {...}, message: "..." }
    // Chúng ta kiểm tra nếu có data thì trả về data đó
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Xử lý lỗi tập trung (ví dụ 401 thì logout)
    if (error?.response?.data) {
      return error.response.data; // Trả về lỗi từ backend để frontend hiển thị
    }
    return Promise.reject(error);
  }
);

export default instance;
