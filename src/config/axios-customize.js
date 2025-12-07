import axios from 'axios';
import { notification } from 'antd';
import { Mutex } from 'async-mutex'; // Cần cài thêm thư viện này: npm install async-mutex

const mutex = new Mutex(); // Khóa để tránh gọi refresh token nhiều lần cùng lúc

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Quan trọng: để gửi Refresh Token (trong cookie) đi
});

// === REQUEST INTERCEPTOR ===
instance.interceptors.request.use(
  function (config) {
    // Luôn lấy token mới nhất từ localStorage
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

// === RESPONSE INTERCEPTOR ===
instance.interceptors.response.use(
  function (response) {
    if (response && response.data) return response.data;
    return response;
  },
  async function (error) {
    // 1. Nếu lỗi không có response (mất mạng, server chết...)
    if (!error.response) {
      notification.error({
        message: 'Lỗi kết nối',
        description: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.',
      });
      return Promise.reject(error);
    }

    const { config, response } = error;
    const { status, data } = response;

    // 2. Xử lý Refresh Token khi gặp lỗi 401
    // Điều kiện: Lỗi 401 + Chưa retry lần nào + Không phải lỗi tại trang login
    if (
      status === 401 &&
      !config._retry &&
      config.url !== '/api/v2/auth/login' &&
      config.url !== '/api/v2/auth/refresh'
    ) {
      config._retry = true; // Đánh dấu đã retry để tránh lặp vô hạn

      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          // Gọi API Refresh Token
          const res = await instance.post('/api/v2/auth/refresh');
          if (res && res.data && res.data.access_token) {
            // Lưu token mới
            localStorage.setItem('access_token', res.data.access_token);
            // Cập nhật header cho request đang bị lỗi
            config.headers['Authorization'] = `Bearer ${res.data.access_token}`;
            return instance(config); // Gọi lại request cũ
          } else {
            // Refresh thất bại (hết hạn refresh token) -> Logout
            handleLogout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          release();
        }
      } else {
        // Nếu đang có tiến trình refresh khác chạy, đợi nó xong rồi retry
        await mutex.waitForUnlock();
        // Lấy token mới vừa được set
        const newToken = localStorage.getItem('access_token');
        if (newToken) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(config);
        }
      }
    }

    // 3. Xử lý các lỗi khác (400, 403, 500...)
    if (status === 400 && data) {
      // Lỗi Validation (thường form sẽ tự handle, không cần popup global nếu muốn)
      // Hoặc có thể hiện nếu cần
      return Promise.reject(data); // Trả về data lỗi để component bắt
    }

    if (status === 403) {
      notification.error({
        message: 'Không có quyền truy cập',
        description:
          data?.message || 'Bạn không được phép thực hiện hành động này.',
      });
    }

    // Lỗi chung chung (500)
    if (status === 500) {
      notification.error({
        message: 'Lỗi hệ thống',
        description: data?.message || 'Có lỗi xảy ra phía máy chủ.',
      });
    }

    // Trả về lỗi dạng object chuẩn để component dễ xử lý (error.message)
    return Promise.reject(data || error);
  }
);

// Hàm Logout chung
const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info'); // Nếu có lưu user
  // Chuyển hướng về login (nếu đang ở trang cần auth)
  if (
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/'
  ) {
    window.location.href = '/login';
  }
  notification.error({
    message: 'Phiên đăng nhập hết hạn',
    description: 'Vui lòng đăng nhập lại.',
  });
};

export default instance;
