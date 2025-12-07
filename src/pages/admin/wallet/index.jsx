import { Card, Col, Row, Statistic, Button, Table } from 'antd';
import {
  WalletOutlined,
  HistoryOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callFetchMyWallet,
  callFetchTransactions,
} from '../../../services/wallet.service';
import ModalWithdraw from './components/modal.withdraw'; // Import từ module mới
import moment from 'moment';
import {
  renderTransactionStatus,
  renderTransactionType,
  renderAmount,
} from '../../../config/utils/render-helpers'; // Import Utils

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

  const fetchWallet = async () => {
    const res = await callFetchMyWallet();
    if (res?.statusCode === 200) setWallet(res.data);
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    const query = `page=${current}&size=${pageSize}&sort=createdAt,desc`;
    const res = await callFetchTransactions(query);
    if (res?.statusCode === 200) {
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

  // Config Table (Dùng Utils Render)
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
      render: (type) => renderTransactionType(type), // ✅ Dùng hàm chung
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (amount, record) => renderAmount(amount, record.type), // ✅ Dùng hàm chung
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => renderTransactionStatus(status), // ✅ Dùng hàm chung
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
