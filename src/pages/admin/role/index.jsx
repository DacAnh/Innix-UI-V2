import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeleteRole, callFetchRole } from '../../../config/api';
import ModalRole from '../../../components/admin/role/modal.role';
import moment from 'moment';

const RolePage = () => {
  const [listRole, setListRole] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await callFetchRole(`page=${current}&size=${pageSize}`);
    if (res && res.statusCode === 200) {
      setListRole(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const handleDelete = async (id) => {
    const res = await callDeleteRole(id);
    if (res && res.statusCode === 200) {
      message.success('Xóa Role thành công');
      fetchData();
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: 'Tên',
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
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
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
        <h2>Quản lý Role</h2>
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
        dataSource={listRole}
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
      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
export default RolePage;
