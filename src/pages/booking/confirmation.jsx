import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Result, Button } from 'antd';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy tham số từ URL (do VNPAY/Backend trả về)
  // Ví dụ: ?vnp_ResponseCode=00...
  // HOẶC nếu Backend redirect về /booking-success thì có thể không có params, chỉ cần hiện thông báo.

  // Tuy nhiên, cách chuẩn là Backend xử lý IPN, rồi redirect user về trang "Cảm ơn".
  // Tại đây ta chỉ cần hiện UI.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <Result
          status="success"
          title="Đặt phòng thành công!"
          subTitle="Cảm ơn bạn đã sử dụng dịch vụ. Mã đặt phòng và thông tin chi tiết đã được gửi đến email của bạn."
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
            <Button key="history" onClick={() => navigate('/user-profile')}>
              Xem lịch sử
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default BookingConfirmation;
