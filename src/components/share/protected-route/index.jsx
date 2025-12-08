import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import NotPermitted from './not-permitted';
import { ADMIN_MODULES } from '../../../config/constants';

const ProtectedRoute = (props) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Kiểm tra quyền Admin
  // Có thể mở rộng logic này: Check permission cụ thể thay vì check role
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const permissions = user?.role?.permissions || [];
  // const adminModules = [
  //   'USERS',
  //   'ROLES',
  //   'PERMISSIONS',
  //   // 'DASHBOARD',
  //   'ACCOMMODATIONS',
  //   'ACCOMMODATION-TYPES',
  //   // 'PARTNER_PORTAL',
  //   'ROOM-TYPES',
  //   'FILES',
  //   'AMENITIES',
  //   'WALLET',
  // ];
  const adminModulesList = Object.values(ADMIN_MODULES);
  const hasAdminAccess = permissions.some(
    (p) => p.module && adminModulesList.includes(p.module.trim())
  );

  // Logic bảo vệ:
  // 1. Nếu chưa đăng nhập -> Đá về trang Login
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã đăng nhập nhưng cố vào trang Admin mà không phải Admin -> Hiện trang NotPermitted
  if (isAdminRoute && !hasAdminAccess) {
    return <NotPermitted />;
  }

  // 3. Nếu hợp lệ -> Cho phép truy cập (Render component con)
  return <>{props.children}</>;
};

export default ProtectedRoute;
