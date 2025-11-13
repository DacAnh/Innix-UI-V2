import { Modal, Form, Input, Select, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreatePermission,
  callUpdatePermission,
} from '../../../config/api';

const ModalPermission = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (openModal && dataInit?.id) {
      form.setFieldsValue(dataInit);
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { name, apiPath, method, module } = values;
    setIsSubmit(true);

    if (dataInit?.id) {
      // Update
      const res = await callUpdatePermission({
        id: dataInit.id,
        name,
        apiPath,
        method,
        module,
      });
      if (res && res.statusCode === 200) {
        message.success('Cập nhật permission thành công');
        handleCancel();
        fetchData();
      } else {
        notification.error({ message: 'Lỗi', description: res.message });
      }
    } else {
      // Create
      const res = await callCreatePermission({ name, apiPath, method, module });
      if (res && res.statusCode === 201) {
        message.success('Tạo mới permission thành công');
        handleCancel();
        fetchData();
      } else {
        notification.error({ message: 'Lỗi', description: res.message });
      }
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật Permission' : 'Tạo mới Permission'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên Permission"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="API Path"
          name="apiPath"
          rules={[{ required: true, message: 'Vui lòng nhập API Path!' }]}
        >
          <Input placeholder="/api/v1/users" />
        </Form.Item>
        <Form.Item
          label="Method"
          name="method"
          rules={[{ required: true, message: 'Vui lòng chọn Method!' }]}
        >
          <Select
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' },
              { value: 'PATCH', label: 'PATCH' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Thuộc Module"
          name="module"
          rules={[{ required: true, message: 'Vui lòng nhập Module!' }]}
        >
          <Input placeholder="Ví dụ: USERS, AUTH, JOBS..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalPermission;
