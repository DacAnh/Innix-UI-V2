import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Active Users"
            value={112893}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Booking"
            value={2000}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};
export default Dashboard;
