import { Card, Col, Row, Statistic, Button, Table, Tag, Space } from 'antd';
import {
  WalletOutlined,
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callFetchMyWallet,
  callFetchTransactions,
} from '../../../services/wallet.service';
import ModalWithdraw from './modal.withdraw';
import moment from 'moment';

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal
  const [openModal, setOpenModal] = useState(false);

  // 1. Fetch thông tin Ví (Số dư)
  const fetchWallet = async () => {
    const res = await callFetchMyWallet();
    if (res && res.statusCode === 200) {
      setWallet(res.data);
    }
  };

  // 2. Fetch lịch sử giao dịch
  const fetchTransactions = async () => {
    setIsLoading(true);
    // Sắp xếp mới nhất lên đầu (sort=createdAt,desc - tùy backend hỗ trợ)
    const query = `page=${current}&size=${pageSize}&sort=createdAt,desc`;
    const res = await callFetchTransactions(query);
    if (res && res.statusCode === 200) {
      setTransactions(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [current, pageSize]);

  // Config hiển thị bảng
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm:ss'),
      width: 180,
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      render: (type) => {
        let color = 'default';
        let icon = null;
        if (type === 'BOOKING_REVENUE') {
          color = 'green';
          icon = <ArrowUpOutlined />;
        } else if (type === 'DEPOSIT') {
          color = 'blue';
          icon = <ArrowUpOutlined />;
        } else if (type === 'WITHDRAW') {
          color = 'red';
          icon = <ArrowDownOutlined />;
        } else if (type === 'COMMISSION_FEE') {
          color = 'orange';
          icon = <ArrowDownOutlined />;
        }

        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (amount, record) => {
        // Tiền vào màu xanh, tiền ra màu đỏ
        const isPositive =
          record.type === 'BOOKING_REVENUE' || record.type === 'DEPOSIT';
        const color = isPositive ? '#3f8600' : '#cf1322';
        const prefix = isPositive ? '+' : '';

        return (
          <span style={{ color: color, fontWeight: 'bold' }}>
            {prefix}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(amount)}
          </span>
        );
      },
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
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          {/* Card Số Dư */}
          <Col span={12}>
            <Card>
              <Statistic
                title="Số dư khả dụng"
                value={wallet?.balance || 0}
                precision={0}
                valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                prefix={<WalletOutlined />}
                suffix="VND"
                formatter={(value) =>
                  new Intl.NumberFormat('vi-VN').format(value)
                }
              />
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<BankOutlined />}
                  onClick={() => setOpenModal(true)}
                >
                  Rút tiền
                </Button>
              </div>
            </Card>
          </Col>

          {/* Card Thống kê phụ (Ví dụ: Tổng thu nhập, Đang chờ duyệt...) - Tùy chọn */}
          <Col span={12}>
            <Card>
              <Statistic
                title="Trạng thái Ví"
                value={wallet?.status || 'UNKNOWN'}
                valueStyle={{ fontSize: 20 }}
              />
              <p style={{ color: '#888', marginTop: 10 }}>
                ID Ví: {wallet?.id}
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Bảng Lịch sử */}
      <Card
        title={
          <span>
            <HistoryOutlined /> Lịch sử giao dịch
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={transactions}
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
      </Card>

      <ModalWithdraw
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchWallet={fetchWallet}
        fetchTransactions={fetchTransactions}
      />
    </div>
  );
};

export default WalletPage;
