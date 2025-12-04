import {
  Table,
  Button,
  Space,
  Tag,
  message,
  notification,
  Tabs,
  Modal,
  Form,
  Input,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import {
  callFetchAdminTransactions,
  callApproveWithdrawal,
  callRejectWithdrawal,
} from '../../../services/wallet.service';
import moment from 'moment';

const TransactionPage = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Filter: Mặc định là xem yêu cầu rút tiền đang chờ (pending)
  const [filterQuery, setFilterQuery] = useState(
    "type:'WITHDRAW' and status:'PENDING'"
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'APPROVE' hoặc 'REJECT'
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setIsLoading(true);
    // Query filter kết hợp pagination
    const query = `page=${current}&size=${pageSize}&filter=${filterQuery}&sort=createdAt,desc`;
    const res = await callFetchAdminTransactions(query);
    if (res && res.statusCode === 200) {
      setListData(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [current, pageSize, filterQuery]);

  // Xử lý khi chuyển Tab
  const handleTabChange = (key) => {
    if (key === 'pending_withdraw') {
      setFilterQuery("type:'WITHDRAW' and status:'PENDING'");
    } else {
      setFilterQuery(''); // Xem tất cả
    }
    setCurrent(1); // Reset về trang 1
  };

  // Mở Modal Duyệt/Từ chối
  const handleAction = (record, type) => {
    setCurrentTransaction(record);
    setActionType(type);
    setIsModalOpen(true);
    form.resetFields();
  };

  // Submit Form trong Modal
  const onFinish = async (values) => {
    let res;
    if (actionType === 'APPROVE') {
      // Gọi API Duyệt (Gửi bankTransactionCode, adminNote)
      res = await callApproveWithdrawal(currentTransaction.id, {
        bankTransactionCode: values.bankTransactionCode,
        adminNote: values.adminNote,
      });
    } else {
      // Gọi API Từ chối (Gửi rejectReason)
      res = await callRejectWithdrawal(currentTransaction.id, {
        rejectReason: values.rejectReason,
      });
    }

    if (res && res.statusCode === 200) {
      message.success(
        actionType === 'APPROVE' ? 'Đã duyệt thành công' : 'Đã từ chối yêu cầu'
      );
      setIsModalOpen(false);
      fetchData(); // Reload lại bảng
    } else {
      notification.error({ message: 'Lỗi', description: res.message });
    }
  };

  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      width: 100,
      ellipsis: true,
      render: (text) => <span title={text}>{text.substring(0, 8)}...</span>,
    },
    {
      title: 'Người yêu cầu',
      dataIndex: ['wallet', 'user', 'email'], // Giả sử backend trả về wallet.user.email
      render: (email) => email || 'N/A',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (amount, record) => {
        const color = record.type === 'WITHDRAW' ? 'red' : 'green';
        return (
          <span style={{ color: color, fontWeight: 'bold' }}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(amount)}
          </span>
        );
      },
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (type) => (
        <Tag color={type === 'WITHDRAW' ? 'orange' : 'blue'}>{type}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'SUCCESS') color = 'success';
        if (status === 'PENDING') color = 'processing';
        if (status === 'FAILED') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hành động',
      width: 200,
      render: (_, record) => {
        // Chỉ hiện nút duyệt nếu là Rút tiền và đang Chờ
        if (record.type === 'WITHDRAW' && record.status === 'PENDING') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAction(record, 'APPROVE')}
                style={{ backgroundColor: '#52c41a' }}
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleAction(record, 'REJECT')}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return null; // Hoặc hiển thị chi tiết nếu cần
      },
    },
  ];

  return (
    <div>
      <h2>Quản lý Giao dịch</h2>

      <Tabs
        defaultActiveKey="pending_withdraw"
        onChange={handleTabChange}
        items={[
          { key: 'pending_withdraw', label: 'Yêu cầu rút tiền (Cần duyệt)' },
          { key: 'all', label: 'Tất cả lịch sử giao dịch' },
        ]}
      />

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
      />

      {/* MODAL DUYỆT / TỪ CHỐI */}
      <Modal
        title={
          actionType === 'APPROVE' ? 'Phê duyệt Rút tiền' : 'Từ chối Rút tiền'
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {actionType === 'APPROVE' ? (
            <>
              <p>
                Bạn đang duyệt khoản rút:{' '}
                <b>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(currentTransaction?.amount || 0)}
                </b>
              </p>
              <Form.Item
                label="Mã giao dịch ngân hàng (Bank Ref)"
                name="bankTransactionCode"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập mã GD ngân hàng để đối soát!',
                  },
                ]}
                tooltip="Nhập mã tham chiếu từ Internet Banking sau khi bạn đã chuyển tiền cho đối tác."
              >
                <Input placeholder="VD: VCB123456789" />
              </Form.Item>
              <Form.Item label="Ghi chú Admin" name="adminNote">
                <Input.TextArea
                  rows={2}
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </Form.Item>
            </>
          ) : (
            <>
              <p>
                Bạn sắp từ chối khoản rút:{' '}
                <b>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(currentTransaction?.amount || 0)}
                </b>
              </p>
              <Form.Item
                label="Lý do từ chối"
                name="rejectReason"
                rules={[
                  { required: true, message: 'Bắt buộc nhập lý do từ chối!' },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="VD: Sai thông tin tài khoản ngân hàng..."
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionPage;
