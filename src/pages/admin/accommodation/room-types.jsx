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
import { callFetchAccommodationById } from '../../../services/accommodation.service';
import {
  callDeleteRoomType,
  callFetchRoomTypesByAccommodation,
  callUpdateRoomAvailability,
} from '../../../services/room.service';
import { useParams, Link } from 'react-router-dom';
import ModalRoomType from '../../../components/admin/accommodation/modal.room-type'; // Modal tạo/sửa thông tin cơ bản
import moment from 'moment';
import PriceCalendar from './components/PriceCalendar';

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
                {/* Cột trái: Danh sách phòng để chọn */}
                <div style={{ flex: 1, maxWidth: '300px' }}>
                  <h3>Chọn loại phòng:</h3>
                  <Table
                    columns={[{ title: 'Tên phòng', dataIndex: 'name' }]}
                    dataSource={listData}
                    rowKey="id"
                    pagination={false}
                    size="small"
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

                {/* Cột phải: Lịch Giá (PriceCalendar) */}
                <div style={{ flex: 3 }}>
                  {selectedRoomType ? (
                    <div
                      style={{
                        background: '#fff',
                        padding: 10,
                        borderRadius: 8,
                        border: '1px solid #f0f0f0',
                      }}
                    >
                      <h3 style={{ marginBottom: 10 }}>
                        Lịch giá của:{' '}
                        <span style={{ color: '#1890ff' }}>
                          {selectedRoomType.name}
                        </span>
                      </h3>
                      {/* ✅ Truyền ID loại phòng vào PriceCalendar */}
                      <PriceCalendar roomTypeId={selectedRoomType.id} />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 400,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#f5f5f5',
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ color: '#999' }}>
                        Vui lòng chọn một loại phòng bên trái để xem lịch giá
                      </span>
                    </div>
                  )}
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
