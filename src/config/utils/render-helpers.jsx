import { Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
  STATUS_COLOR,
} from '../../config/constants';

// Render Transaction Type (Loại giao dịch)
export const renderTransactionType = (type) => {
  let color = 'default';
  let icon = null;
  let text = type;

  switch (type) {
    case TRANSACTION_TYPE.BOOKING_REVENUE:
      color = 'green';
      icon = <ArrowUpOutlined />;
      text = 'Doanh thu';
      break;
    case TRANSACTION_TYPE.DEPOSIT:
      color = 'blue';
      icon = <ArrowUpOutlined />;
      text = 'Nạp tiền';
      break;
    case TRANSACTION_TYPE.WITHDRAW:
      color = 'volcano';
      icon = <ArrowDownOutlined />;
      text = 'Rút tiền';
      break;
    case TRANSACTION_TYPE.COMMISSION_FEE:
      color = 'orange';
      icon = <ArrowDownOutlined />;
      text = 'Phí sàn';
      break;
    case TRANSACTION_TYPE.REFUND:
      color = 'purple';
      icon = <ArrowUpOutlined />;
      text = 'Hoàn tiền';
      break;
    default:
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

// Render Transaction Status (Trạng thái)
export const renderTransactionStatus = (status) => {
  let color = 'default';
  let icon = null;
  let text = status;

  switch (status) {
    case TRANSACTION_STATUS.SUCCESS:
      color = STATUS_COLOR[TRANSACTION_STATUS.SUCCESS] || 'success';
      icon = <CheckCircleOutlined />;
      text = 'Thành công';
      break;
    case TRANSACTION_STATUS.PENDING:
      color = STATUS_COLOR[TRANSACTION_STATUS.PENDING] || 'processing';
      icon = <ClockCircleOutlined />;
      text = 'Đang xử lý';
      break;
    case TRANSACTION_STATUS.FAILED:
      color = STATUS_COLOR[TRANSACTION_STATUS.FAILED] || 'error';
      icon = <CloseCircleOutlined />;
      text = 'Thất bại';
      break;
    default:
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

// Render Amount (Số tiền có màu sắc)
export const renderAmount = (amount, type) => {
  const isPositive =
    type === TRANSACTION_TYPE.BOOKING_REVENUE ||
    type === TRANSACTION_TYPE.DEPOSIT ||
    type === TRANSACTION_TYPE.REFUND;

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
};
