import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/share/dropdown-button/DropdownButton';
import axios from 'config/axios-customize';
import { callLogout } from '../../../config/api';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

/**
 * A component that renders the navigation items for the navbar for both mobile/desktop view.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.isAuthenticated - A flag indicating whether the user is authenticated.
 * @param {Function} props.onHamburgerMenuToggle
 */
const NavbarItems = (onHamburgerMenuToggle) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  // Kiểm tra xem user có phải ADMIN không
  // Lưu ý: Cấu trúc user.role của Innix-BE trả về có thể là Object {name: "ADMIN"} hoặc String "ADMIN"
  // Bạn cần log user ra để xem chính xác. Dưới đây là code an toàn.
  const isAdmin = user?.role?.name === 'ADMIN' || user?.role === 'ADMIN';

  /**
   * Handles the logout action by calling the logout API and updating the authentication state.
   */
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
    { name: 'Đăng xuất', onClick: handleLogout },
  ];

  /**
   * Determines if a given path is the current active path.
   *
   * @param {string} path - The path to check.
   * @returns {boolean} - True if the path is active, false otherwise.
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

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
          <div className="flex gap-4 items-center">
            {/* NÚT VÀO TRANG ADMIN */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-brand font-bold border border-brand px-3 py-1 rounded hover:bg-brand hover:text-white transition"
              >
                Trang Quản Trị
              </Link>
            )}
            <span>
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
