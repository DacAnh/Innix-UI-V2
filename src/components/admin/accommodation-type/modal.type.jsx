import { Modal, Form, Input, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreateAccommodationType,
  callUpdateAccommodationType,
} from '../../../config/api';

const ModalAccommodationType = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (openModal && dataInit?.id) {
      form.setFieldsValue(dataInit);
    } else {
      form.resetFields();
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { name, displayName, iconUrl, description } = values;
    setIsSubmit(true);

    if (dataInit?.id) {
      // Update
      const res = await callUpdateAccommodationType(values, dataInit.id);
      if (res && res.statusCode === 200) {
        message.success('Cập nhật thành công');
        handleCancel();
        fetchData();
      } else {
        notification.error({ message: 'Lỗi', description: res.message });
      }
    } else {
      // Create
      const res = await callCreateAccommodationType(values);
      if (res && res.statusCode === 201) {
        message.success('Tạo mới thành công');
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
      title={dataInit?.id ? 'Cập nhật Loại hình' : 'Tạo mới Loại hình'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mã loại hình (Code)"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập mã (VD: HOTEL)!' }]}
        >
          <Input placeholder="HOTEL" />
        </Form.Item>
        <Form.Item
          label="Tên hiển thị"
          name="displayName"
          rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
        >
          <Input placeholder="Khách sạn" />
        </Form.Item>
        <Form.Item
          label="Icon URL"
          name="iconUrl"
          rules={[{ required: true, message: 'Vui lòng nhập URL icon!' }]}
        >
          <Input placeholder="https://example.com/icon.png" />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAccommodationType;
