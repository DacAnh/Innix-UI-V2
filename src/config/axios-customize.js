import axios from 'axios';
import { notification } from 'antd';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Ví dụ: http://localhost:8080/api/v2
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

// Xử lý dữ liệu trả về (Chỉ lấy phần data cần thiết)
instance.interceptors.response.use(
  function (response) {
    // Chúng ta kiểm tra nếu có data thì trả về data đó
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Lấy data và status từ lỗi
    const data = error?.response?.data;
    const status = error?.response?.status;

    // 2. Xử lý lỗi 403 (Access Denied - Cấm truy cập)
    if (status === 403 && data) {
      // Hiển thị thông báo lỗi 403 toàn cục
      notification.error({
        message: data.error || 'Không có quyền',
        description:
          data.message || 'Bạn không có quyền thực hiện hành động này.',
      });
      // Vẫn trả về data để logic ở component (nếu có) không bị crash
      return data;
    }

    // Xử lý lỗi 401 (Unauthorized - Chưa xác thực)
    // (Bạn có thể thêm logic logout ở đây nếu cần)
    if (status === 401 && data) {
      notification.error({
        message: data.error || 'Lỗi xác thực',
        description: data.message || 'Vui lòng đăng nhập lại.',
      });
      // Tùy chọn: gọi hàm logout tại đây
    }

    // Các lỗi 400 (Validation) hoặc 500 (Server)
    if (data) {
      return data; // Trả về cho component tự xử lý (như trang Login, Register)
    }

    return Promise.reject(error);
  }
);

export default instance;
