import React, { useState } from 'react';
import {
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HeartOutlined,
  DollarOutlined,
  ExceptionOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { callLogout } from '../../config/api';
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
    logout();
    message.success('Đăng xuất thành công');
    navigate('/login');
  };

  // Menu items cho Sidebar
  const items = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: 'dashboard',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/admin/user">Quản lý người dùng</Link>,
      key: 'user',
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/admin/hotel">Quản lý nơi ở</Link>, // Ví dụ thêm
      key: 'hotel',
      icon: <FileTextOutlined />,
    },
    {
      label: <Link to="/admin/permission">Quản lý quyền</Link>,
      key: '/admin/permission',
      icon: <TeamOutlined />,
    },
    {
      label: <Link to="/admin/role">Quản lý vai trò</Link>,
      key: '/admin/role',
      icon: <SafetyCertificateOutlined />,
    },
  ];

  // Menu dropdown cho Avatar
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
          defaultSelectedKeys={[activeMenu]}
          items={items}
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
              Welcome, {user?.name}
              <Avatar src="https://joeschmoe.io/api/v1/random" />
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
