import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Icon loading xoay tròn (dùng icon của Antd)
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Chiếm toàn bộ chiều cao màn hình
        width: '100%',
        backgroundColor: '#f0f2f5', // Màu nền nhẹ nhàng
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999, // Đảm bảo luôn nằm trên cùng
      }}
    >
      <Spin indicator={antIcon} tip="Đang tải..." size="large" />
    </div>
  );
};

export default Loading;
