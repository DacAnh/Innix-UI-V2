import logo from 'assests/logos/stay_booker_logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from './header/hamburger'; // Sửa đường dẫn import nếu cần
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import NavbarItems from './header/navbar-items'; // Sửa đường dẫn import nếu cần

const GlobalNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const onHamburgerMenuToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    // 1. Thêm 'h-20' (hoặc h-16) để cố định chiều cao.
    // 2. Thêm 'flex-nowrap' để tránh bị xuống dòng linh tinh trên desktop.
    <div className="relative h-20 flex flex-nowrap justify-between items-center px-4 md:px-12 global-navbar__container bg-brand brand-divider-bottom shadow-md z-50">
      {/* Logo container: Cũng phải full height và căn giữa */}
      <div className="flex items-center h-full">
        <Link to="/" className="flex items-center h-full">
          {/* Chỉnh max-h để logo không bị to quá khổ so với navbar */}
          <img
            src={logo}
            alt="site logo"
            className="site-logo__img object-contain max-h-12"
          />
        </Link>
      </div>

      {/* Menu Desktop: h-full để các thẻ li bên trong nhận được chiều cao */}
      <ul className="list-none hidden md:flex h-full items-center gap-1">
        <NavbarItems isAuthenticated={isAuthenticated} />
      </ul>

      {/* Nút Hamburger Mobile */}
      <FontAwesomeIcon
        data-testid="menu-toggle__button"
        icon={faBars}
        size="2x"
        color="#fff"
        className="block md:hidden cursor-pointer"
        onClick={onHamburgerMenuToggle}
      />

      {/* Menu Mobile (Overlay) */}
      <HamburgerMenu
        isVisible={isVisible}
        onHamburgerMenuToggle={onHamburgerMenuToggle}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default GlobalNavbar;
