import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, message, Spin } from 'antd';
import {
  callFetchRoomAvailability,
  callUpdateRoomAvailability,
} from '../../../../config/api';

const localizer = momentLocalizer(moment);

const PriceCalendar = ({ roomTypeId }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [form] = Form.useForm();

  // Hàm fetch dữ liệu lịch
  const fetchAvailability = async () => {
    setIsLoading(true);
    // Lấy dữ liệu 3 tháng tới (hoặc dựa vào view hiện tại của lịch)
    const start = moment().startOf('month').format('YYYY-MM-DD');
    const end = moment().add(3, 'months').endOf('month').format('YYYY-MM-DD');

    try {
      const res = await callFetchRoomAvailability(roomTypeId, start, end);
      if (res && res.statusCode === 200) {
        // Map dữ liệu từ Backend sang format của Calendar
        // Backend trả về List<RoomAvailabilityResponse>
        const mappedEvents = res.data.map((item) => ({
          title: `${new Intl.NumberFormat('vi-VN').format(item.price)}đ\n(SL: ${item.quantityAvailable})`,
          start: new Date(item.date),
          end: new Date(item.date),
          allDay: true,
          resource: item,
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (roomTypeId) fetchAvailability();
  }, [roomTypeId]);

  // Khi chọn ngày trên lịch
  const handleSelectSlot = ({ start, end }) => {
    // start và end là Date object. End của big-calendar thường bị thừa 1 ngày nếu chọn range, cần xử lý kỹ.
    // Logic đơn giản:
    setSelectedRange({ start, end: moment(end).subtract(1, 'days').toDate() }); // Fix lỗi range
    setModalOpen(true);
  };

  const handleUpdatePrice = async (values) => {
    const payload = {
      roomTypeId: roomTypeId,
      startDate: moment(selectedRange.start).format('YYYY-MM-DD'),
      endDate: moment(selectedRange.end).format('YYYY-MM-DD'),
      price: values.price,
      quantityAvailable: values.quantity,
    };

    try {
      const res = await callUpdateRoomAvailability(payload);
      if (res && res.statusCode === 200) {
        message.success('Cập nhật thành công!');
        setModalOpen(false);
        fetchAvailability(); // Reload lịch
      } else {
        message.error(res?.message || 'Lỗi cập nhật');
      }
    } catch (error) {
      message.error('Lỗi hệ thống');
    }
  };

  // Custom hiển thị ô ngày
  const eventStyleGetter = (event) => {
    const backgroundColor =
      event.resource.quantityAvailable > 0 ? '#3174ad' : '#e74c3c';
    return {
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.8em',
        textAlign: 'center',
        whiteSpace: 'pre-wrap', // Cho phép xuống dòng
      },
    };
  };

  return (
    <div style={{ height: 600, background: 'white', padding: 20 }}>
      <Spin spinning={isLoading}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month']}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
        />
      </Spin>

      {/* Modal Cập nhật Giá & Tồn kho */}
      <Modal
        title={`Cập nhật giá: ${moment(selectedRange.start).format('DD/MM')} - ${moment(selectedRange.end).format('DD/MM')}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpdatePrice}>
          <Form.Item
            label="Giá tiền (VND)"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng phòng trống"
            name="quantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PriceCalendar;
