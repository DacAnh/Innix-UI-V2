import {
  Table,
  Button,
  Breadcrumb,
  Tabs,
  message,
  notification,
  Row,
  Col,
  Card,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Import Services (Nhớ dùng service đã tách)
import { callFetchAccommodationById } from '../../../services/accommodation.service';
import {
  callFetchRoomTypesByAccommodation,
  callDeleteRoomType,
} from '../../../services/room.service';

// Import Components (Từ module mới)
import RoomTypeTable from './components/RoomTypeTable';
import PriceCalendar from './components/PriceCalendar';
import ModalRoomType from './components/modal.room-type';

const RoomTypePage = () => {
  const { id: accommodationId } = useParams();
  const [accommodation, setAccommodation] = useState(null);

  // Data State
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  // Selection State
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    const res = await callFetchRoomTypesByAccommodation(
      accommodationId,
      'page=1&size=100'
    );
    if (res?.statusCode === 200) {
      setRoomTypes(res.data.result);
      // Nếu đang chọn 1 phòng mà phòng đó bị xóa/update, cần handle lại (optional)
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchAcc = async () => {
      const res = await callFetchAccommodationById(accommodationId);
      if (res?.statusCode === 200) setAccommodation(res.data);
    };
    fetchAcc();
    fetchData();
  }, [accommodationId]);

  // 2. Handlers
  const handleDelete = async (id) => {
    const res = await callDeleteRoomType(accommodationId, id);
    if (res?.statusCode === 204) {
      message.success('Xóa thành công');
      fetchData();
      if (selectedRoomType?.id === id) setSelectedRoomType(null); // Clear selection
    } else {
      notification.error({ message: 'Lỗi', description: res?.message });
    }
  };

  const handleEdit = (record) => {
    setDataInit(record);
    setOpenModal(true);
  };

  const handleCreate = () => {
    setDataInit(null);
    setOpenModal(true);
  };

  // 3. Tab Items Configuration
  const items = [
    {
      key: 'list',
      label: 'Danh sách Loại phòng',
      children: (
        <RoomTypeTable
          dataSource={roomTypes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={setSelectedRoomType} // Click để chọn xem nhanh
          selectedId={selectedRoomType?.id}
        />
      ),
    },
    {
      key: 'calendar',
      label: 'Quản lý Giá & Tồn kho',
      children: (
        <Row gutter={24}>
          {/* Cột Trái: Danh sách nhỏ để chọn */}
          <Col span={6}>
            <Card title="Chọn phòng" size="small" bodyStyle={{ padding: 0 }}>
              {/* ✅ SỬA Ở ĐÂY: Dùng Table đơn giản thay vì RoomTypeTable */}
              <Table
                columns={[
                  {
                    title: 'Tên phòng',
                    dataIndex: 'name',
                    render: (text) => (
                      <span style={{ fontWeight: 500 }}>{text}</span>
                    ),
                  },
                ]}
                dataSource={roomTypes}
                loading={loading}
                rowKey="id"
                pagination={false}
                size="small"
                // Logic highlight dòng đang chọn (Màu xanh nhạt)
                onRow={(record) => ({
                  onClick: () => setSelectedRoomType(record),
                  style: {
                    cursor: 'pointer',
                    background:
                      selectedRoomType?.id === record.id
                        ? '#e6f7ff'
                        : 'transparent',
                    transition: 'background 0.3s',
                  },
                })}
              />
            </Card>
          </Col>

          {/* Cột Phải: Lịch */}
          <Col span={18}>
            <Card>
              {selectedRoomType ? (
                <>
                  <h3 style={{ marginBottom: 16 }}>
                    Lịch giá:{' '}
                    <span style={{ color: '#1890ff' }}>
                      {selectedRoomType.name}
                    </span>
                  </h3>
                  <PriceCalendar roomTypeId={selectedRoomType.id} />
                </>
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
                    Vui lòng chọn một loại phòng bên trái
                  </span>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin/accommodation">
            <HomeOutlined /> Quản lý Chỗ ở
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{accommodation?.name || 'Loading...'}</Breadcrumb.Item>
        <Breadcrumb.Item>Loại phòng</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý: {accommodation?.name}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm Loại phòng
        </Button>
      </div>

      {/* Tabs Content */}
      <Tabs defaultActiveKey="list" items={items} />

      {/* Modal */}
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
