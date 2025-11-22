import { Card, DatePicker, Button, InputNumber, Divider } from 'antd';
import { useState } from 'react';

const HotelBookingDetailsCard = ({ hotel, dateRange, onDateChange }) => {
  // Giá hiển thị tạm thời (cần logic lấy giá từ RoomType rẻ nhất)
  const displayPrice = 0;

  return (
    <Card className="shadow-lg rounded-xl border-t-4 border-brand">
      <div className="mb-4">
        <span className="text-gray-500">Giá chỉ từ</span>
        <div className="flex items-baseline">
          <span className="text-gray-500">Giá tham khảo</span>
          <span className="text-3xl font-bold text-brand">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(displayPrice)}
          </span>
          <span className="text-gray-400 ml-1">/ đêm</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày nhận/trả phòng
          </label>
          <DatePicker.RangePicker
            className="w-full py-2"
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={onDateChange}
            placeholder={['Nhận phòng', 'Trả phòng']}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng khách
          </label>
          <InputNumber min={1} defaultValue={2} className="w-full py-1" />
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="bg-brand hover:bg-blue-700 h-12 text-lg font-bold mt-4"
        >
          Chọn phòng
        </Button>
      </div>

      <Divider />
      <div className="text-xs text-gray-500 mt-2">
        * Vui lòng chọn ngày để xem giá chính xác.
      </div>
    </Card>
  );
};

export default HotelBookingDetailsCard;
