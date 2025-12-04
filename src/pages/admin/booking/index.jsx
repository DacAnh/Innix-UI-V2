import { Table, Button, Space, Tag, Select, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import {
  callFetchBookings,
  callUpdateBookingStatus,
} from '../../../services/booking.service';
import moment from 'moment';

const BookingPage = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    // API này tự động lọc theo Role (Admin/Partner/User) ở Backend
    const res = await callFetchBookings(`page=${current}&size=${pageSize}`);
    if (res && res.statusCode === 200) {
      setListData(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const handleStatusChange = async (bookingId, status) => {
    const res = await callUpdateBookingStatus(bookingId, { status });
    if (res && res.statusCode === 200) {
      message.success('Cập nhật trạng thái thành công!');
      fetchData(); // Tải lại bảng
    } else {
      notification.error({ message: 'Lỗi', description: res.message });
    }
  };

  const columns = [
    { title: 'Chỗ ở', dataIndex: 'accommodation', render: (acc) => acc?.name },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      render: (user) => user?.fullName,
    },
    {
      title: 'Ngày nhận phòng',
      dataIndex: 'checkInDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày trả phòng',
      dataIndex: 'checkOutDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price) + ' VND',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          // Chỉ cho phép đổi nếu đang PENDING
          disabled={status !== 'PENDING'}
        >
          <Select.Option value="PENDING">
            <Tag color="orange">Chờ duyệt</Tag>
          </Select.Option>
          <Select.Option value="CONFIRMED">
            <Tag color="green">Đã duyệt</Tag>
          </Select.Option>
          <Select.Option value="CANCELLED">
            <Tag color="red">Hủy</Tag>
          </Select.Option>
          <Select.Option value="COMPLETED">
            <Tag color="blue">Hoàn thành</Tag>
          </Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Đơn đặt phòng</h2>
      <Table
        columns={columns}
        dataSource={listData}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total,
          onChange: (p, s) => {
            setCurrent(p);
            setPageSize(s);
          },
        }}
      />
    </div>
  );
};
export default BookingPage;
