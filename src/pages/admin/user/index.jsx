import { Table, Button, Space, Popconfirm, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../../../config/axios-customize';
import { callDeleteUser } from '../../../config/api';
import ModalUser from '../../../components/admin/user/modal.user';
import Access from '../../../components/share/access';

const UserPage = () => {
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/v2/users?page=${current}&size=${pageSize}`
      );
      if (res && res.statusCode === 200) {
        setListUser(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  // === HÀM XỬ LÝ XÓA ===
  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res && res.statusCode === 200) {
      message.success('Xóa user thành công');
      fetchUser(); // Load lại bảng
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <a href="#">{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'fullName', // Chú ý: Backend trả về fullName (DTO)
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleUser',
      render: (text, record) => {
        return record.roleUser?.name ?? 'USER';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa */}
          <Access
            permission={{
              method: 'PUT',
              apiPath: '/api/v2/users',
              module: 'USERS',
            }}
            hideChildren={true}
          >
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => {
                setDataInit(record); // Gán dữ liệu dòng hiện tại vào state
                setOpenModal(true); // Mở Modal
              }}
            >
              Sửa
            </Button>
          </Access>

          {/* Nút Xóa */}
          <Access
            permission={{
              method: 'DELETE',
              apiPath: '/api/v2/users/{id}',
              module: 'USERS',
            }}
            hideChildren={true}
          >
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger>
                Xóa
              </Button>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const onChange = (pagination) => {
    if (pagination && pagination.current !== current)
      setCurrent(pagination.current);
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>Quản lý người dùng</h2>
        <Access
          permission={{
            method: 'POST',
            apiPath: '/api/v2/users',
            module: 'USERS',
          }}
          hideChildren={true}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setDataInit(null); // Reset data cũ
              setOpenModal(true); // Mở Modal thêm mới
            }}
          >
            Thêm mới
          </Button>
        </Access>
      </div>

      <Table
        columns={columns}
        dataSource={listUser}
        loading={isLoading}
        rowKey="id"
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
        }}
      />

      {/* Component Modal đặt ở đây */}
      <ModalUser
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchUser={fetchUser}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default UserPage;
