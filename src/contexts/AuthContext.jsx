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
    setUser({ email: '', name: '' });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
        // Bạn cần check cấu trúc response của API này (dự đoán là res.data hoặc res.result)
        if (res && res.statusCode === 200) {
          // Giả sử dữ liệu user nằm trong res.data
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Nếu token hết hạn hoặc lỗi thì logout luôn
        console.log('Lỗi xác thực user:', error);
        // logout(); // Có thể bật dòng này nếu muốn chặt chẽ
      }
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
