import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/share/dropdown-button/DropdownButton';
import { callLogout } from '../../../config/api';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  // 1. Lấy danh sách permissions của user
  const permissions = user?.role?.permissions || [];

  // 2. Định nghĩa danh sách các Module thuộc về trang Admin
  // (Bạn có thể thêm các module khác vào đây nếu sau này phát triển thêm như 'HOTELS', 'BOOKINGS'...)
  const adminModules = [
    'USERS',
    'ROLES',
    'PERMISSIONS',
    'DASHBOARD',
    'ACCOMMODATIONS',
    'ROOMS',
  ];

  // 3. Kiểm tra: Nếu user có ít nhất 1 quyền thuộc các module quản trị -> Cho phép vào
  const hasAdminAccess = permissions.some((p) =>
    adminModules.includes(p.module)
  );

  const handleLogout = async () => {
    try {
      // 2. Gọi API Backend để xóa token/cookie phía server (nếu cần)
      await callLogout();
    } catch (error) {
      console.log('Lỗi khi gọi API logout:', error);
    } finally {
      // 3. Gọi hàm logout của Context để xóa state và localStorage phía client
      logout();

      // 4. Chuyển hướng về trang login hoặc trang chủ
      navigate('/login');
      // toast.success("Đăng xuất thành công");
    }
  };

  const dropdownOptions = [
    { name: 'Trang cá nhân', onClick: () => navigate('/user-profile') },
  ];

  // Thêm mục "Trang Quản Trị" vào giữa danh sách nếu thỏa mãn điều kiện
  if (hasAdminAccess) {
    dropdownOptions.push({
      name: 'Trang quản trị',
      onClick: () => navigate('/admin'),
    });
  }

  // Thêm mục Đăng xuất vào cuối cùng
  dropdownOptions.push({ name: 'Đăng xuất', onClick: handleLogout });

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Class style chung cho chữ trên menu
  const textStyle = 'uppercase font-medium text-slate-100';

  return (
    <>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Trang chủ
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/hotels') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Khách sạn
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/about-us') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Về chúng tôi
        </Link>
      </li>
      <li
        className={`${!isAuthenticated && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuthenticated ? (
          <div className="flex gap-4 items-center pl-5">
            {/* NÚT VÀO TRANG ADMIN
            {isAdmin && (
              <Link
                to="/admin"
                className="text-brand font-bold border border-brand px-3 py-1 rounded hover:bg-brand hover:text-white transition"
              >
                Trang Quản Trị
              </Link>
            )} */}
            <span className={`${textStyle} normal-case`}>
              Xin chào, <b>{user?.name}</b>
            </span>
            <DropdownButton triggerType="click" options={dropdownOptions} />
          </div>
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${
              isActive('/login') && 'active-link'
            }`}
            onClick={onHamburgerMenuToggle}
          >
            Đăng nhập / Đăng ký
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;
