import React, { createContext, useState, useEffect } from 'react';
import { callFetchAccount } from '../config/api';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: '',
    name: '',
  },
  login: (userData) => {}, // Hàm này để Login.jsx gọi
  logout: () => {},
  appLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    email: '',
    name: '',
  });
  const [appLoading, setAppLoading] = useState(true);

  // Hàm set dữ liệu khi đăng nhập thành công
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({ email: '', name: '', role: { name: '', permissions: [] } });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('innix_user'); // Xóa user khi logout
    // Có thể điều hướng về trang login ở đây nếu muốn
  };

  // Logic giữ đăng nhập khi F5 (Refresh trang)
  const fetchAccount = async () => {
    setAppLoading(true);
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        const res = await callFetchAccount();
        // Kiểm tra kết quả trả về từ API getAccount
        // Cần check cấu trúc response của API này
        if (res && res.statusCode === 200) {
          const userFromApi = res.data?.user;
          if (userFromApi) {
            setUser(userFromApi);
            setIsAuthenticated(true);
            // Cập nhật lại localStorage nếu có thay đổi
            localStorage.setItem('innix_user', JSON.stringify(userFromApi));
          }
        } else if (res && res.statusCode === 403) {
          // 2. LÀ USER THƯỜNG (Bị 403 từ /account)
          // API thất bại, nhưng token vẫn hợp lệ.
          // Lấy data cũ từ localStorage đã lưu lúc login.
          const localUser = localStorage.getItem('innix_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
            setIsAuthenticated(true);
          } else {
            // Có token nhưng ko có data user -> Lỗi -> Logout
            logout();
          }
        } else {
          // 3. Lỗi khác (401, 500...) -> Token hỏng
          logout();
        }
      } catch (error) {
        // Nếu token hết hạn hoặc lỗi thì logout luôn
        console.log('Lỗi xác thực user:', error);
        // logout(); // Có thể bật dòng này nếu muốn chặt chẽ
      }
    } else {
      // 5. Không có token
      setIsAuthenticated(false);
    }
    setAppLoading(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, appLoading }}
    >
      {/* Chỉ render app khi đã check xong auth để tránh nháy giao diện */}
      {appLoading ? <div>Đang tải...</div> : children}
    </AuthContext.Provider>
  );
};
