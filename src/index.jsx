import React, { Suspense, lazy } from 'react'; // Import Suspense và lazy
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import './index.scss';

// Import các component chung (Layout, Loading) vẫn giữ nguyên để tải nhanh
import BaseLayout from './components/share/layout.app';
import LayoutAdmin from './components/admin/layout.admin';
import ProtectedRoute from './components/share/protected-route/index';
import Loading from './components/share/loading'; // Giả sử bạn có component Loading

// --- LAZY LOAD CÁC PAGE ---
// Client Pages
const Home = lazy(() => import('./pages/home/index'));
const HotelsPage = lazy(() => import('./pages/hotel/index'));
// const HotelsSearch = lazy(() => import('./pages/hotel')); // (Cũ - bỏ nếu không dùng)
const AboutUs = lazy(() => import('./pages/about-us'));
const UserProfile = lazy(() => import('./pages/user'));
const HotelDetails = lazy(() => import('./pages/hotel/detail'));
const Checkout = lazy(() => import('pages/booking'));
const BookingConfirmation = lazy(() => import('./pages/booking/confirmation'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/login'));
const Register = lazy(() => import('./pages/auth/register'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const UserPage = lazy(() => import('./pages/admin/user'));
const RolePage = lazy(() => import('./pages/admin/role'));
const PermissionPage = lazy(() => import('./pages/admin/permission'));
const AccommodationTypePage = lazy(
  () => import('./pages/admin/accommodation-type')
);
const AccommodationPage = lazy(() => import('./pages/admin/accommodation'));
const RoomTypePage = lazy(() => import('./pages/admin/room-type/room-types'));
const BookingPage = lazy(() => import('./pages/admin/booking'));
const WalletPage = lazy(() => import('./pages/admin/wallet'));
const TransactionPage = lazy(() => import('./pages/admin/transaction'));

// if (process.env.NODE_ENV === 'development') {
// makeServer();
// }

// makeServer();

// Helper để bọc Suspense cho gọn
const LazyWrapper = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: '/hotels',
        element: (
          <LazyWrapper>
            <HotelsPage />
          </LazyWrapper>
        ),
      },
      {
        path: '/about-us',
        element: (
          <LazyWrapper>
            <AboutUs />
          </LazyWrapper>
        ),
      },
      {
        path: '/user-profile',
        element: (
          <LazyWrapper>
            <UserProfile />
          </LazyWrapper>
        ),
      },
      {
        path: '/login',
        element: (
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        ),
      },
      {
        path: '/register',
        element: (
          <LazyWrapper>
            <Register />
          </LazyWrapper>
        ),
      },
      {
        path: '/hotel/:hotelId',
        element: (
          <LazyWrapper>
            <HotelDetails />
          </LazyWrapper>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <LazyWrapper>
            <ForgotPassword />
          </LazyWrapper>
        ),
      },
      {
        path: '/checkout',
        element: (
          <LazyWrapper>
            <Checkout />
          </LazyWrapper>
        ),
      },
      {
        path: '/booking-confirmation',
        element: (
          <LazyWrapper>
            <BookingConfirmation />
          </LazyWrapper>
        ),
      },
    ],
  },

  // ADMIN ROUTES
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'user',
        element: (
          <LazyWrapper>
            <UserPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'role',
        element: (
          <LazyWrapper>
            <RolePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'permission',
        element: (
          <LazyWrapper>
            <PermissionPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'accommodation-type',
        element: (
          <LazyWrapper>
            <AccommodationTypePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'accommodation',
        element: (
          <LazyWrapper>
            <AccommodationPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'accommodation/:id/room-types',
        element: (
          <LazyWrapper>
            <RoomTypePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'booking',
        element: (
          <LazyWrapper>
            <BookingPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'wallet',
        element: (
          <LazyWrapper>
            <WalletPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'transactions',
        element: (
          <LazyWrapper>
            <TransactionPage />
          </LazyWrapper>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

reportWebVitals();
