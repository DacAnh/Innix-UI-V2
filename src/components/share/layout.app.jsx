import GlobalFooter from 'components/client/footer.client';
import GlobalNavbar from 'components/client/header.client';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'components/share/scroll-to-top';

/**
 * BaseLayout Component
 * Renders the base layout for the application.
 * It includes the global navbar, the main content, and the global footer.
 * @returns {JSX.Element} - The BaseLayout component.
 */
const BaseLayout = () => {
  return (
    <>
      <GlobalNavbar />
      <ScrollToTop />
      <Outlet />
      <GlobalFooter />
    </>
  );
};

export default BaseLayout;
