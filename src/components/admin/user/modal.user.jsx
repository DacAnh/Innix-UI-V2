import {
  Modal,
  Form,
  Input,
  message,
  notification,
  InputNumber,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreateUser,
  callUpdateUser,
  callFetchRole,
} from '../../../config/api';

const ModalUser = (props) => {
  const { openModal, setOpenModal, fetchUser, dataInit, setDataInit } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]); // State lưu danh sách role
  const [form] = Form.useForm();

  // 1. Hàm lấy danh sách Role (Lấy hết 1 lần)
  useEffect(() => {
    const fetchRoles = async () => {
      // Lấy 100 role (hoặc số lượng lớn đủ dùng)
      const res = await callFetchRole(`page=1&size=100`);
      if (res && res.statusCode === 200) {
        // Map dữ liệu Role thành format cho Select của Ant Design
        const roles = res.data.result.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setRoleOptions(roles);
      }
    };
    // Gọi hàm này khi Modal mở ra
    if (openModal) {
      fetchRoles();
    }
  }, [openModal]);

  // === LOGIC 1: Khi mở Modal (Edit) -> Tách fullName thành firstName/lastName ===
  useEffect(() => {
    if (openModal && dataInit?.id) {
      // Tách chuỗi tên
      const fullName = dataInit.fullName || ''; // Backend trả về fullName
      const lastSpaceIndex = fullName.lastIndexOf(' ');
      let firstName = '';
      let lastName = '';

      if (lastSpaceIndex !== -1) {
        lastName = fullName.substring(0, lastSpaceIndex); // Họ (phần đầu)
        firstName = fullName.substring(lastSpaceIndex + 1); // Tên (phần cuối)
      } else {
        firstName = fullName; // Trường hợp tên chỉ có 1 từ
      }

      // Fill dữ liệu vào form
      form.setFieldsValue({
        ...dataInit,
        firstName: firstName,
        lastName: lastName,
        // Role chỉ cần ID để Select tự map với options
        role: dataInit.role ? dataInit.role.id : null,
      });
    }
  }, [dataInit, openModal, roleOptions]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      address,
      phone,
      role,
    } = values;

    // === LOGIC 2: Gộp firstName + lastName -> fullName để gửi Backend ===
    const fullName = `${lastName} ${firstName}`.trim();
    // Role lúc này là ID (value), cần bọc vào object roleUser
    const roleUser = role ? { id: role } : null;

    setIsSubmit(true);

    if (dataInit?.id) {
      // === UPDATE USER ===
      const userUpdate = {
        id: dataInit.id,
        fullName: fullName,
        age,
        gender,
        address,
        phone,
        roleUser, // Gửi roleUser update
      };

      const res = await callUpdateUser(userUpdate);
      if (res && res.statusCode === 200) {
        message.success('Cập nhật user thành công');
        handleCancel();
        fetchUser();
      } else {
        notification.error({
          message: 'Đã có lỗi xảy ra',
          description: res.message,
        });
      }
    } else {
      // === CREATE USER ===
      const userCreate = {
        fullName: fullName,
        email,
        password,
        age,
        gender,
        address,
        phone,
        roleUser,
      };
      const res = await callCreateUser(userCreate);
      if (res && res.statusCode === 201) {
        message.success('Thêm mới user thành công');
        handleCancel();
        fetchUser();
      } else {
        notification.error({
          message: 'Đã có lỗi xảy ra',
          description: res.message,
        });
      }
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật người dùng' : 'Tạo mới người dùng'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
      width={600}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input disabled={!!dataInit?.id} />
        </Form.Item>

        {!dataInit?.id && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {/* TÁCH 2 Ô INPUT CHO HỌ VÀ TÊN */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Item
            label="Họ (Last Name)"
            name="lastName"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn" />
          </Form.Item>

          <Form.Item
            label="Tên (First Name)"
            name="firstName"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Ví dụ: A" />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Item
            label="Tuổi"
            name="age"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Nhập tuổi!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={18} />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            style={{ flex: 1 }}
            initialValue={'MALE'}
          >
            <Select>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            allowClear
            options={roleOptions} // Truyền danh sách Role đã fetch
          />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUser;
