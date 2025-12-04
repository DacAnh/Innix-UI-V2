import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  notification,
  Image,
} from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  callDeleteAccommodationType,
  callFetchAccommodationType,
} from '../../../services/accommodation.service';
import ModalAccommodationType from '../../../components/admin/accommodation-type/modal.type';
import Access from '../../../components/share/access'; // Đừng quên phân quyền!

const AccommodationTypePage = () => {
  const [listType, setListType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const query = `page=${current}&size=${pageSize}`;
    const res = await callFetchAccommodationType(query);
    if (res && res.statusCode === 200) {
      setListType(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const handleDelete = async (id) => {
    const res = await callDeleteAccommodationType(id);
    if (res && res.statusCode === 200) {
      message.success('Xóa thành công');
      fetchData();
    } else {
      notification.error({ message: 'Lỗi xóa', description: res.message });
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: 'Code', dataIndex: 'name', render: (text) => <b>{text}</b> },
    { title: 'Tên hiển thị', dataIndex: 'displayName' },
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      render: (url) => <Image src={url} width={40} />,
    },
    { title: 'Mô tả', dataIndex: 'description', ellipsis: true },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Access
            permission={{
              method: 'PUT',
              apiPath: '/api/v2/accommodation-types/{id}',
              module: 'ACCOMMODATION_TYPES',
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
              apiPath: '/api/v2/accommodation-types/{id}',
              module: 'ACCOMMODATION_TYPES',
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý Loại hình Lưu trú</h2>
        <Access
          permission={{
            method: 'POST',
            apiPath: '/api/v2/accommodation-types',
            module: 'ACCOMMODATION_TYPES',
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
        dataSource={listType}
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
      <ModalAccommodationType
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default AccommodationTypePage;
