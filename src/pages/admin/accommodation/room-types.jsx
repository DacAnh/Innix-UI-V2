import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  notification,
  Breadcrumb,
  Tabs,
  Card,
  InputNumber,
  DatePicker,
  Form,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  callDeleteRoomType,
  callFetchRoomTypesByAccommodation,
  callFetchAccommodationById,
  callUpdateRoomAvailability,
} from '../../../config/api';
import { useParams, Link } from 'react-router-dom';
import ModalRoomType from '../../../components/admin/accommodation/modal.room-type'; // Modal tạo/sửa thông tin cơ bản
import moment from 'moment';

const RoomTypePage = () => {
  const { id: accommodationId } = useParams();
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accommodation, setAccommodation] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  // State cho Tab Quản lý Giá
  const [selectedRoomType, setSelectedRoomType] = useState(null); // Loại phòng đang chọn để set giá

  const fetchData = async () => {
    setIsLoading(true);
    const res = await callFetchRoomTypesByAccommodation(
      accommodationId,
      'page=1&size=100'
    );
    if (res && res.statusCode === 200) {
      setListData(res.data.result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchAcc = async () => {
      const res = await callFetchAccommodationById(accommodationId);
      if (res && res.statusCode === 200) setAccommodation(res.data);
    };
    fetchAcc();
    fetchData();
  }, [accommodationId]);

  const handleDelete = async (id) => {
    const res = await callDeleteRoomType(accommodationId, id);
    if (res && res.statusCode === 204) {
      // Delete thành công trả về 204
      message.success('Xóa loại phòng thành công');
      fetchData();
    } else {
      notification.error({ message: 'Lỗi', description: res.message });
    }
  };

  // --- TABLE CỘT CHO TAB 1: QUẢN LÝ LOẠI PHÒNG ---
  const columns = [
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      render: (text, record) => (
        <a
          onClick={() => {
            setDataInit(record);
            setOpenModal(true);
          }}
        >
          {text}
        </a>
      ),
    },
    { title: 'Sức chứa', render: (_, record) => `${record.maxGuest} người` },
    { title: 'Diện tích', render: (_, record) => `${record.areaSize} m²` },
    { title: 'Giường', dataIndex: 'bedConfiguration' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setDataInit(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- COMPONENT CON: QUẢN LÝ GIÁ (SƠ SƠ) ---
  const PriceManagement = () => {
    const [form] = Form.useForm();

    const onFinishPrice = async (values) => {
      if (!selectedRoomType) {
        message.error('Vui lòng chọn loại phòng trên bảng bên trái!');
        return;
      }
      const payload = {
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        price: values.price,
        quantity: values.quantity,
      };

      const res = await callUpdateRoomAvailability(
        accommodationId,
        selectedRoomType.id,
        payload
      );
      if (res && res.statusCode === 200) {
        message.success('Cập nhật giá thành công!');
      } else {
        notification.error({ message: 'Lỗi', description: res.message });
      }
    };

    return (
      <Card
        title={
          selectedRoomType
            ? `Thiết lập giá cho: ${selectedRoomType.name}`
            : 'Vui lòng chọn loại phòng'
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinishPrice}>
          <Form.Item
            label="Khoảng ngày áp dụng"
            name="dateRange"
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Giá theo đêm (VND)"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
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
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Button
            type="primary"
            icon={<DollarOutlined />}
            htmlType="submit"
            disabled={!selectedRoomType}
          >
            Cập nhật giá
          </Button>
        </Form>
      </Card>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin/accommodation">
            <HomeOutlined /> Quản lý Chỗ ở
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{accommodation?.name || 'Chi tiết'}</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý: {accommodation?.name}</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setDataInit(null);
            setOpenModal(true);
          }}
        >
          Thêm Loại phòng
        </Button>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Danh sách Loại phòng',
            children: (
              <Table
                columns={columns}
                dataSource={listData}
                loading={isLoading}
                rowKey="id"
                // Khi click vào dòng -> Chọn loại phòng để set giá
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedRoomType(record);
                    message.info(`Đã chọn: ${record.name}`);
                  },
                })}
              />
            ),
          },
          {
            key: '2',
            label: 'Quản lý Giá & Tồn kho',
            children: (
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <h3>Danh sách phòng (Click để chọn)</h3>
                  <Table
                    columns={[{ title: 'Tên', dataIndex: 'name' }]}
                    dataSource={listData}
                    rowKey="id"
                    pagination={false}
                    onRow={(record) => ({
                      onClick: () => setSelectedRoomType(record),
                      style: {
                        cursor: 'pointer',
                        background:
                          selectedRoomType?.id === record.id ? '#e6f7ff' : '',
                      },
                    })}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <PriceManagement />
                </div>
              </div>
            ),
          },
        ]}
      />

      <ModalRoomType
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        dataInit={dataInit}
        setDataInit={setDataInit}
        accommodationId={accommodationId}
      />
    </div>
  );
};

export default RoomTypePage;
