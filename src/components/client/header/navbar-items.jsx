import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from '../../share/dropdown-button/DropdownButton';
import { callLogout, callFetchAccommodationType } from '../../../config/api';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [accommodationTypes, setAccommodationTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await callFetchAccommodationType('page=1&size=100');
        if (res && res.statusCode === 200) {
          setAccommodationTypes(res.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTypes();
  }, []);

  const permissions = user?.role?.permissions || [];
  const adminModules = [
    'USERS',
    'ROLES',
    'PERMISSIONS',
    'DASHBOARD',
    'ACCOMMODATIONS',
    'ACCOMMODATION_TYPES',
  ];
  const hasAdminAccess = permissions.some(
    (p) => p.module && adminModules.includes(p.module.trim())
  );

  const handleLogout = async () => {
    try {
      await callLogout();
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const dropdownOptions = [
    { name: 'Trang cá nhân', onClick: () => navigate('/user-profile') },
  ];
  if (hasAdminAccess) {
    dropdownOptions.unshift({
      name: 'Trang Quản Trị',
      onClick: () => navigate('/admin'),
    });
  }
  dropdownOptions.push({ name: 'Đăng xuất', onClick: handleLogout });

  const isActive = (path) => location.pathname === path;

  const textStyle = 'uppercase font-medium text-slate-100';

  // ✅ QUAN TRỌNG:
  // h-full: Chiếm hết chiều cao navbar (80px)
  // flex items-center: Căn chữ vào GIỮA theo chiều dọc
  const liStyle =
    'h-full flex items-center px-4 hover:bg-blue-900 md:hover:bg-brand cursor-pointer transition-colors duration-200';

  return (
    <>
      {/* Trang chủ */}
      <li className={liStyle}>
        <Link
          to="/"
          className={`${textStyle} hover-underline-animation ${isActive('/') && 'active-link'}`}
          onClick={onHamburgerMenuToggle}
        >
          Trang chủ
        </Link>
      </li>

      {/* Loại hình động */}
      {accommodationTypes.length > 0 &&
        accommodationTypes.map((type) => (
          <li key={type.id} className={liStyle}>
            <Link
              to={`/hotels?type=${type.id}`}
              className={`${textStyle} hover-underline-animation ${isActive(`/hotels?type=${type.id}`) && 'active-link'}`}
              onClick={onHamburgerMenuToggle}
            >
              {type.displayName}
            </Link>
          </li>
        ))}

      {/* Về chúng tôi */}
      <li className={liStyle}>
        <Link
          to="/about-us"
          className={`${textStyle} hover-underline-animation ${isActive('/about-us') && 'active-link'}`}
          onClick={onHamburgerMenuToggle}
        >
          Về chúng tôi
        </Link>
      </li>

      {/* Phần User / Đăng nhập */}
      {isAuthenticated ? (
        // Đã đăng nhập
        <li className={liStyle}>
          <div className="flex items-center gap-3">
            <span className={`${textStyle} normal-case whitespace-nowrap`}>
              Xin chào, <b>{user?.name}</b>
            </span>
            {/* DropdownButton tự bản thân nó phải được style chuẩn, không cần translate bên ngoài */}
            <div className="flex items-center">
              <DropdownButton triggerType="click" options={dropdownOptions} />
            </div>
          </div>
        </li>
      ) : (
        // Chưa đăng nhập
        <li className={liStyle}>
          <Link
            to="/login"
            className={`${textStyle} hover-underline-animation ${isActive('/login') && 'active-link'}`}
            onClick={onHamburgerMenuToggle}
          >
            Đăng nhập / Đăng ký
          </Link>
        </li>
      )}
    </>
  );
};

export default NavbarItems;
