import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import HotelsSearch from './pages/hotel';
import UserProfile from './pages/user';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home/index';
import { AuthProvider } from './contexts/AuthContext';
import { makeServer } from './mirage/mirageServer';
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
    element: <LayoutAdmin />, // Layout riêng cho admin
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
