import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import NavbarItems from 'components/client/header/navbar-items';

const HamburgerMenu = (props) => {
  const { isVisible, onHamburgerMenuToggle, isAuthenticated } = props;

  return (
    <div
      data-testid="hamburger-menu"
      className={`bg-brand shadow-2xl z-20 ${
        isVisible ? 'fixed right-0 w-1/2 top-0 h-screen' : 'hidden'
      }`}
    >
      <div className="absolute right-5 top-2">
        <FontAwesomeIcon
          data-testid="menu-close__button"
          icon={faXmark}
          size="2x"
          color="#fff"
          onClick={onHamburgerMenuToggle}
        />
      </div>
      <ul className="list-none mt-12">
        <NavbarItems
          onHamburgerMenuToggle={onHamburgerMenuToggle}
          isAuthenticated={isAuthenticated}
        />
      </ul>
    </div>
  );
};

export default HamburgerMenu;
