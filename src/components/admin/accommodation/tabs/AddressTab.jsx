import { Row, Col, Form, Input, InputNumber } from 'antd';

const AddressTab = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Quốc gia"
          name="country"
          rules={[{ required: true }]}
          initialValue="Việt Nam"
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Địa chỉ chi tiết"
          name="addressLine"
          rules={[{ required: true }]}
        >
          <Input placeholder="Số nhà, tên đường..." />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Vĩ độ (Lat)" name="latitude">
          <InputNumber style={{ width: '100%' }} placeholder="VD: 21.0285" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Kinh độ (Long)" name="longitude">
          <InputNumber style={{ width: '100%' }} placeholder="VD: 105.8542" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AddressTab;
