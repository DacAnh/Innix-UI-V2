import { Table, Button, Space, Popconfirm, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeletePermission, callFetchPermission } from '../../../config/api';
import ModalPermission from '../../../components/admin/permission/modal.permission';
import moment from 'moment';

const PermissionPage = () => {
  const [listPermission, setListPermission] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const query = `page=${current}&size=${pageSize}`;
    const res = await callFetchPermission(query);
    if (res && res.statusCode === 200) {
      setListPermission(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const handleDelete = async (id) => {
    const res = await callDeletePermission(id);
    if (res && res.statusCode === 200) {
      message.success('Xóa thành công');
      fetchData();
    } else {
      notification.error({ message: 'Lỗi xóa', description: res.message });
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: 'Tên',
      dataIndex: 'name',
      render: (text, record) => (
        <a
          href="#"
          onClick={() => {
            setDataInit(record);
            setOpenModal(true);
          }}
        >
          {text}
        </a>
      ),
    },
    { title: 'API', dataIndex: 'apiPath' },
    {
      title: 'Method',
      dataIndex: 'method',
      render: (text) => {
        let color =
          text === 'GET'
            ? 'green'
            : text === 'POST'
              ? 'blue'
              : text === 'PUT'
                ? 'orange'
                : 'red';
        return <span style={{ color: color, fontWeight: 'bold' }}>{text}</span>;
      },
    },
    { title: 'Module', dataIndex: 'module' },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Action',
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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý Permission</h2>
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
        dataSource={listPermission}
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
      <ModalPermission
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
export default PermissionPage;
