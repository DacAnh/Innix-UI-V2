import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import HotelsSearch from './pages/hotel';
import UserProfile from './pages/user';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home/index';
import { AuthProvider } from './contexts/AuthContext';
import HotelDetails from './pages/hotel/detail';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import AboutUs from './pages/about-us';
import BaseLayout from './components/share/layout.app';
import ForgotPassword from './pages/auth/forgot-password';
import Checkout from 'pages/booking';
import BookingConfirmation from 'pages/booking/confirmation';
import LayoutAdmin from './components/admin/layout.admin';
import Dashboard from './pages/admin/dashboard';
import UserPage from './pages/admin/user';
import RolePage from './pages/admin/role';
import PermissionPage from './pages/admin/permission';
import AccommodationTypePage from './pages/admin/accommodation-type';
import ProtectedRoute from './components/share/protected-route.ts/index';
import AccommodationPage from './pages/admin/accommodation';
import RoomTypePage from './pages/admin/accommodation/room-types'; // Mới
import BookingPage from './pages/admin/booking'; // Mới

// if (process.env.NODE_ENV === 'development') {
// makeServer();
// }

// makeServer();

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/hotels',
        element: <HotelsSearch />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/user-profile',
        element: <UserProfile />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelDetails />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/booking-confirmation',
        element: <BookingConfirmation />,
      },
    ],
  },

  // THÊM MỚI NHÁNH ADMIN
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ), // Layout riêng cho admin
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'role',
        element: <RolePage />,
      },
      {
        path: 'permission',
        element: <PermissionPage />,
      },
      { path: 'accommodation-type', element: <AccommodationTypePage /> },
      { path: 'accommodation', element: <AccommodationPage /> },
      { path: 'accommodation/:id/room-types', element: <RoomTypePage /> },
      { path: 'booking', element: <BookingPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

reportWebVitals();
