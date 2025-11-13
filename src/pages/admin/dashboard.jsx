import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

const Dashboard = () => {
  // Cấu hình formatter để Ant Design dùng CountUp hiển thị số
  const formatter = (value) => (
    <CountUp end={value} separator="," duration={2.5} />
  );
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Người dùng"
            value={112893}
            formatter={formatter}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Tổng số đặt phòng"
            value={2000}
            formatter={formatter}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};
export default Dashboard;
