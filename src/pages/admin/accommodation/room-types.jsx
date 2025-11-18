import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  notification,
  Breadcrumb,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {
  callDeleteRoomType,
  callFetchRoomTypesByAccommodation,
  callFetchAccommodationById,
} from '../../../config/api';
import { useParams, Link } from 'react-router-dom';
import ModalRoomType from '../../../components/admin/accommodation/modal.room-type';
import Access from '../../../components/share/access';
import moment from 'moment';

const RoomTypePage = () => {
  const { id: accommodationId } = useParams();
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accommodation, setAccommodation] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

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
      if (res && res.statusCode === 200) {
        setAccommodation(res.data);
      }
    };
    fetchAcc();
    fetchData();
  }, [accommodationId]);

  const handleDelete = async (id) => {
    const res = await callDeleteRoomType(accommodationId, id);
    if (res && res.statusCode === 200) {
      message.success('Xóa loại phòng thành công');
      fetchData();
    } else {
      notification.error({ message: 'Lỗi', description: res.message });
    }
  };

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
    { title: 'Số lượng', dataIndex: 'quantity' },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
    },
    { title: 'Sức chứa (Người lớn)', dataIndex: 'capacityAdult' },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Access
            permission={{
              method: 'PUT',
              apiPath: '/api/v2/partner/room-types/{id}',
              module: 'ROOM_TYPES',
            }}
            hideChildren
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setDataInit(record);
                setOpenModal(true);
              }}
            />
          </Access>
          <Access
            permission={{
              method: 'DELETE',
              apiPath: '/api/v2/partner/room-types/{id}',
              module: 'ROOM_TYPES',
            }}
            hideChildren
          >
            <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <div>
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
        <h2>Quản lý Loại phòng</h2>
        <Access
          permission={{
            method: 'POST',
            apiPath: '/api/v2/partner/accommodations/{id}/room-types',
            module: 'ROOM_TYPES',
          }}
          hideChildren
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setDataInit(null);
              setOpenModal(true);
            }}
          >
            Thêm mới
          </Button>
        </Access>
      </div>
      <Table
        columns={columns}
        dataSource={listData}
        loading={isLoading}
        rowKey="id"
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
