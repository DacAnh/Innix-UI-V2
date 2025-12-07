import { Form, Input, InputNumber, Select, Row, Col } from 'antd';

const UserInfoTab = ({ isEditMode, roleOptions }) => {
  return (
    <Row gutter={16}>
      {/* Email - Disabled khi edit */}
      <Col span={24}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!', type: 'email' },
          ]}
        >
          <Input disabled={isEditMode} placeholder="example@domain.com" />
        </Form.Item>
      </Col>

      {/* Mật khẩu - Chỉ hiện khi tạo mới */}
      {!isEditMode && (
        <Col span={24}>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Col>
      )}

      {/* Họ và Tên */}
      <Col span={12}>
        <Form.Item
          label="Họ (Last Name)"
          name="lastName"
          rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Tên (First Name)"
          name="firstName"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Ví dụ: A" />
        </Form.Item>
      </Col>

      {/* Tuổi và Giới tính */}
      <Col span={12}>
        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: 'Nhập tuổi!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={18} placeholder="18+" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Giới tính" name="gender" initialValue="MALE">
          <Select>
            <Select.Option value="MALE">Nam</Select.Option>
            <Select.Option value="FEMALE">Nữ</Select.Option>
            <Select.Option value="OTHER">Khác</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* SĐT và Địa chỉ */}
      <Col span={12}>
        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="09xxxxxxxx" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Col>

      {/* Vai trò (Role) - Đã gộp vào đây */}
      <Col span={24}>
        <Form.Item
          label="Vai trò (Role)"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            allowClear
            options={roleOptions}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default UserInfoTab;
