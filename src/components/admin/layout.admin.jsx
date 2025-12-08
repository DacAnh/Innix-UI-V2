import React, { useState, useContext, useMemo } from 'react';
import {
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { checkModuleAccess } from '../../config/utils/access.control'; // ✅ Import hàm check quyền
import { callLogout } from '../../services/auth.service';
import { ADMIN_MODULES } from '../../config/constants'; // ✅ Import tên module chuẩn
import './layout.admin.scss';

const { Header, Sider, Content, Footer } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await callLogout();
    } catch (error) {
      console.log(error);
    }
    // Nếu context có hàm logout thì gọi, không thì tự clear
    if (logout) logout();
    else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
    }
    message.success('Đăng xuất thành công');
    navigate('/login');
  };

  // --- LOGIC PHÂN QUYỀN MENU ---
  const menuItems = useMemo(() => {
    // 1. Định nghĩa cấu trúc menu gốc (kèm module)
    const rawItems = [
      {
        label: <Link to="/admin">Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />,
        module: null, // Public (Ai vào admin cũng thấy)
      },
      {
        label: <Link to="/admin/user">Quản lý người dùng</Link>,
        key: 'user',
        icon: <UserOutlined />,
        module: ADMIN_MODULES.USERS, // 'USERS'
      },
      {
        label: <Link to="/admin/accommodation-type">Loại hình lưu trú</Link>,
        key: 'accommodation-type',
        icon: <FileTextOutlined />,
        module: ADMIN_MODULES.ACCOMMODATION_TYPES, // 'ACCOMMODATION-TYPES'
      },
      {
        label: <Link to="/admin/permission">Quản lý quyền</Link>,
        key: '/admin/permission',
        icon: <TeamOutlined />,
        module: ADMIN_MODULES.PERMISSIONS, // 'PERMISSIONS'
      },
      {
        label: <Link to="/admin/role">Quản lý vai trò</Link>,
        key: '/admin/role',
        icon: <SafetyCertificateOutlined />,
        module: ADMIN_MODULES.ROLES, // 'ROLES'
      },
      {
        label: <Link to="/admin/accommodation">Quản lý chỗ ở</Link>,
        key: 'accommodation',
        icon: <HomeOutlined />,
        module: ADMIN_MODULES.ACCOMMODATIONS, // 'ACCOMMODATIONS'
      },
      {
        label: <Link to="/admin/booking">Quản lý đơn hàng</Link>,
        key: 'booking',
        icon: <ShoppingCartOutlined />,
        module: ADMIN_MODULES.BOOKINGS, // 'BOOKINGS'
      },
      {
        label: <Link to="/admin/wallet">Ví của tôi</Link>,
        key: 'wallet',
        icon: <WalletOutlined />,
        module: ADMIN_MODULES.WALLET, // 'WALLET'
      },
      {
        label: <Link to="/admin/transactions">Quản lý Giao dịch</Link>,
        key: 'transactions',
        icon: <DollarCircleOutlined />,
        module: ADMIN_MODULES.TRANSACTIONS, // 'TRANSACTIONS'
      },
    ];

    // 2. Lọc menu dựa trên quyền
    return rawItems.filter((item) => {
      // Nếu không có module -> Hiện luôn
      if (!item.module) return true;

      // Nếu là Partner -> Luôn hiện các mục cốt lõi của họ (Hack nếu DB chưa chuẩn)
      // (Nếu DB bạn đã gán module cho Partner chuẩn rồi thì bỏ đoạn if này đi)
      if (
        user?.role?.name === 'PARTNER' &&
        [
          ADMIN_MODULES.ACCOMMODATIONS,
          ADMIN_MODULES.BOOKINGS,
          ADMIN_MODULES.WALLET,
        ].includes(item.module)
      ) {
        return true;
      }

      // Check quyền bằng hàm util
      return checkModuleAccess(user, item.module);
    });
  }, [user]); // Chạy lại khi user thay đổi

  const itemsDropdown = [
    {
      label: <Link to={'/'}>Trang chủ</Link>,
      key: 'home',
    },
    {
      label: (
        <label style={{ cursor: 'pointer' }} onClick={handleLogout}>
          Đăng xuất
        </label>
      ),
      key: 'logout',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} className="layout-admin">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'INNIX' : 'INNIX ADMIN'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeMenu]} // Highlight mục đang chọn
          items={menuItems} // ✅ Sử dụng mảng menuItems đã lọc
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 20,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' },
            }
          )}

          <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              Welcome, {user?.name || user?.fullName}
              <Avatar
                src={user?.avatar || 'https://joeschmoe.io/api/v1/random'}
              />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Innix Booking ©{new Date().getFullYear()} Created by Innix Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
