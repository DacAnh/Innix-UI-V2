import { Form, Input, Switch, Row, Col } from 'antd';

const RoleInfoTab = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Tên Role"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên role!' }]}
        >
          <Input placeholder="VD: ADMIN, PARTNER..." />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Trạng thái" name="active" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chức năng của role này..."
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default RoleInfoTab;
