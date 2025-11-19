import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  notification,
  Image,
} from 'antd';
import { useEffect, useState, useContext } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import {
  callDeleteAccommodation,
  callFetchAllAccommodation,
  callFetchMyAccommodation,
  callFetchAccommodationById,
} from '../../../config/api';
import ModalAccommodation from '../../../components/admin/accommodation/modal.accommodation';
import Access from '../../../components/share/access';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const AccommodationPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  const isAdmin = user?.role?.name === 'ADMIN';

  const fetchData = async () => {
    setIsLoading(true);
    const query = `page=${current}&size=${pageSize}`;
    let res;
    if (isAdmin) {
      res = await callFetchAllAccommodation(query);
    } else {
      res = await callFetchMyAccommodation(query);
    }

    if (res && res.statusCode === 200) {
      setListData(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize, user]);

  const handleDelete = async (id) => {
    const res = await callDeleteAccommodation(id);
    if (res && res.statusCode === 200) {
      message.success('Xóa thành công');
      fetchData();
    } else {
      notification.error({ message: 'Lỗi xóa', description: res.message });
    }
  };

  const handleEdit = async (id) => {
    // Gọi API chi tiết để lấy full data (bao gồm amenities, description...)
    const res = await callFetchAccommodationById(id);
    if (res && res.statusCode === 200) {
      setDataInit(res.data);
      setOpenModal(true);
    }
  };

  const columns = [
    {
      title: 'Tên Chỗ ở',
      dataIndex: 'name',
      render: (text, record) => (
        <a onClick={() => handleEdit(record.id)}>{text}</a>
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnailImageUrl',
      render: (url) => (url ? <Image src={url} width={50} /> : 'N/A'),
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      render: (type) => type?.displayName || 'N/A',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'addressLine',
      render: (_, record) =>
        `${record.addressLine}, ${record.ward}, ${record.province}`,
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'contactPhone',
    },
    // Cột Quản lý Phòng
    {
      title: 'Quản lý Phòng',
      key: 'roomTypes',
      render: (_, record) => (
        <Access
          permission={{
            method: 'GET',
            apiPath: '/api/v2/partner/accommodations/{id}/room-types',
            module: 'ROOM_TYPES',
          }}
          hideChildren
        >
          <Button
            type="dashed"
            icon={<AppstoreOutlined />}
            onClick={() =>
              navigate(`/admin/accommodation/${record.id}/room-types`)
            }
          >
            Loại phòng
          </Button>
        </Access>
      ),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý Chỗ ở</h2>
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
      </div>
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
        scroll={{ x: 1000 }}
      />
      <ModalAccommodation
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default AccommodationPage;
