import GlobalFooter from 'components/client/footer.client';
import GlobalNavbar from 'components/client/header.client';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'components/share/scroll-to-top';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BaseLayout = () => {
  return (
    <>
      <GlobalNavbar />
      <ScrollToTop />
      <Outlet />
      <GlobalFooter />

      {/* 3. Đặt ToastContainer ở đây để nó hiện đè lên mọi trang */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default BaseLayout;
